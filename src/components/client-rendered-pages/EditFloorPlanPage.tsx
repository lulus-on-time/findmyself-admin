"use client";

import React, { useEffect, useRef, useState } from "react";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import {
  AimOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Slider,
  Tooltip,
  Upload,
  message,
  notification,
} from "antd";
import type { UploadProps } from "antd";
import { spaceLabelIcon } from "@/components/icons/marker";
import { getFloorPlanDetail, postEditFloorPlan } from "@/services/floorPlan";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_ROUTES } from "@/config/constants";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import SpaceDetailModal from "@/components/modals/SpaceDetailModal";
import FpTutorialModal from "@/components/modals/FpTutorialModal";
import { LabelMarkers } from "../../app/floor-plan/type";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { isMarkerInsidePolygon } from "@/utils/helper";

const EditFloorPlanPage = () => {
  const floorId = useSearchParams().get("floorId");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  // Map
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapLRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.ImageOverlay | null>(null);
  const editableLayers = useRef<L.FeatureGroup | null>(null);
  const globalLayer = useRef<L.Polygon | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>("");
  const [categoryValue] = useState<string>("room");
  const [labelMarkersDict] = useState<LabelMarkers>({});
  // Modal
  const [tutorialModalOpen, setTutorialModalOpen] = useState<boolean>(false);
  const [createSpaceModalOpen, setCreateSpaceModalOpen] =
    useState<boolean>(false);
  const [editSpaceModalOpen, setEditSpaceModalOpen] = useState<boolean>(false);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  // Form
  const [createSpaceForm] = Form.useForm();
  const [editSpaceForm] = Form.useForm();
  const [floorPlanForm] = Form.useForm();
  // Service
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Data
  const [formValues, setFormValues] = useState<any>(null);
  const [floorPlanData, setFloorPlanData] = useState<any>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (unsavedChanges) {
        const confirmationMessage =
          "Are you sure you want to leave? Your changes may not be saved.";
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  useEffect(() => {
    if (!isMounted && mapDivRef.current) {
      setIsMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapDivRef.current]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await getFloorPlanDetail(floorId);
      setFloorPlanData(response.data);
      setIsFetching(false);
    } catch (error: any) {
      setErrorStatus(true);
      if (error.response?.data?.error?.message) {
        setErrorMessage(error.response.data.error.message);
      } else {
        setErrorMessage(error.toString());
      }
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isMounted && floorPlanData) initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, floorPlanData]);

  const initMap = () => {
    floorPlanForm.setFieldValue("floorLevel", floorPlanData.floor.level);
    floorPlanForm.setFieldValue("floorName", floorPlanData.floor.name);

    // @ts-ignore
    if (mapDivRef.current && !mapDivRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 1,
      });
      map.zoomControl.setPosition("bottomright");
      map.fitBounds([
        [0, 0],
        [floorPlanData.floor.maxY, floorPlanData.floor.maxX],
      ]);

      editableLayers.current = new L.FeatureGroup();
      map.addLayer(editableLayers.current);
      // @ts-ignore
      function onEachFeature(feature: any, layer: any) {
        if (feature.properties.category === "corridor") {
          layer.setStyle({ fillColor: "gray", color: "white" });
        } else {
          layer.setStyle({ fillColor: "black", color: "white" });
        }

        var labelMarker = L.marker(feature.properties.poi, {
          draggable: true,
          icon: spaceLabelIcon(feature.properties.name),
        }).addTo(map);
        labelMarkersDict[feature.properties.id] = labelMarker;

        labelMarker.on("dragend", function () {
          if (!isMarkerInsidePolygon(labelMarker, layer)) {
            labelMarker.setLatLng(feature.properties.poi);
            message.error("POI marker must remain inside the defined space");
            return;
          }
          var poi = labelMarker.getLatLng();
          layer!.feature!.properties.poi = [poi.lat, poi.lng];
          setUnsavedChanges(true);
        });

        labelMarker.on("dblclick", function () {
          globalLayer.current = layer;
          setEditSpaceModalOpen(true);
          editSpaceForm.setFieldValue(
            "category",
            layer!.feature!.properties.category,
          );
          editSpaceForm.setFieldValue(
            "spaceName",
            layer!.feature!.properties.name,
          );
        });

        editableLayers.current!.addLayer(layer);
      }

      L.geoJSON(floorPlanData.geojson, {
        onEachFeature: onEachFeature,
      });

      const drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e1e100",
              message: "Polygon lines must not intersect",
            },
          },
          circle: false,
          circlemarker: false,
          rectangle: {},
          marker: false,
        },
        edit: {
          featureGroup: editableLayers.current,
          remove: false,
          edit: false,
        },
      });
      L.EditToolbar.Delete.include({
        removeAllLayers: false,
      });
      map.addControl(drawControl);

      map.on("draw:created", function (e) {
        const layer = (e as L.DrawEvents.Created).layer;
        // @ts-ignore
        globalLayer.current = layer;
        editableLayers.current!.addLayer(layer!);

        setCreateSpaceModalOpen(true);
      });

      mapLRef.current = map;
    }
  };

  useEffect(() => {
    if (baseImageUrl && mapLRef.current) {
      const baseImage = new Image();
      baseImage.src = baseImageUrl;

      baseImage.onload = () => {
        var bounds = [
          [0, 0],
          [baseImage.height, baseImage.width],
        ];

        if (overlayRef.current) {
          mapLRef.current!.removeLayer(overlayRef.current);
        }

        // @ts-ignore
        const newOverlay = L.imageOverlay(baseImageUrl, bounds);
        newOverlay.addTo(mapLRef.current!);
        overlayRef.current = newOverlay;

        // @ts-ignore
        mapLRef.current!.fitBounds(bounds);
      };

      baseImage.onerror = (error) => {
        notification.open({
          type: "error",
          message: "Error loading image",
          description: "Please try again.",
        });
        console.error(error);
      };
    }
  }, [baseImageUrl]);

  const props: UploadProps = {
    name: "file",
    accept: ".png, .jpg, .jpeg, .webp, .svg",
    multiple: false,
    maxCount: 1,
    customRequest(options) {
      const { file, onSuccess } = options;
      if (file && onSuccess) {
        // @ts-ignore
        setBaseImageUrl(URL.createObjectURL(file));
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      }
    },
    showUploadList: false,
  };

  const createSpace = (values: any) => {
    setUnsavedChanges(true);

    var category = values.category;
    var spaceName = values.spaceName;

    var map = mapLRef.current;
    var layer = globalLayer.current;

    var poi = (layer as L.Polygon).getBounds().getCenter();
    var labelMarker = L.marker(poi, {
      draggable: true,
      icon: spaceLabelIcon(spaceName),
    });
    if (!isMarkerInsidePolygon(labelMarker, layer)) {
      var reversedPoi = (layer as L.Polygon).toGeoJSON().geometry
        .coordinates[0][0] as number[];
      poi = new LatLng(reversedPoi[1], reversedPoi[0]);
      labelMarker.setLatLng(poi);
    }
    labelMarker.addTo(map!);
    // @ts-ignore
    labelMarkersDict[layer._leaflet_id] = labelMarker;

    layer!.feature = {
      type: "Feature",
      properties: {
        category: category,
        name: spaceName,
        poi: [poi.lat, poi.lng],
      },
      geometry: layer!.toGeoJSON().geometry,
    };

    labelMarker.on("dragend", function () {
      if (!isMarkerInsidePolygon(labelMarker, layer)) {
        labelMarker.setLatLng(poi);
        message.error("POI marker must remain inside the defined space");
        return;
      }
      poi = labelMarker.getLatLng();
      layer!.feature!.properties.poi = [poi.lat, poi.lng];
    });

    labelMarker.on("dblclick", function () {
      globalLayer.current = layer;
      setEditSpaceModalOpen(true);
      editSpaceForm.setFieldValue(
        "category",
        layer!.feature!.properties.category,
      );
      editSpaceForm.setFieldValue("spaceName", layer!.feature!.properties.name);
    });

    if (category === "corridor") {
      layer!.setStyle({ fillColor: "gray", color: "white", opacity: 1 });
    } else {
      layer!.setStyle({ fillColor: "black", color: "white", opacity: 1 });
    }

    setCreateSpaceModalOpen(false);
    createSpaceForm.resetFields();
  };

  const editSpace = (values: any) => {
    setUnsavedChanges(true);

    var category = values.category;
    var spaceName = values.spaceName;

    var layer = globalLayer.current;
    if (layer?.feature?.properties.id) {
      var labelMarker = labelMarkersDict[layer.feature.properties.id];
    } else {
      // @ts-ignore
      var labelMarker = labelMarkersDict[layer._leaflet_id];
    }
    labelMarker.setIcon(spaceLabelIcon(spaceName));
    layer!.feature!.properties.category = category;
    layer!.feature!.properties.name = spaceName;

    if (category === "corridor") {
      layer!.setStyle({ fillColor: "gray", color: "white", opacity: 1 });
    } else {
      layer!.setStyle({ fillColor: "black", color: "white", opacity: 1 });
    }

    setEditSpaceModalOpen(false);
    editSpaceForm.resetFields();
  };

  const cancelCreateSpace = () => {
    editableLayers.current!.removeLayer(globalLayer.current!);
    setCreateSpaceModalOpen(false);
    createSpaceForm.resetFields();
  };

  const cancelEditSpace = () => {
    setEditSpaceModalOpen(false);
    editSpaceForm.resetFields();
  };

  const deleteSpace = () => {
    setUnsavedChanges(true);

    var map = mapLRef.current;
    var layer = globalLayer.current;
    if (layer!.feature!.properties.id) {
      map!.removeLayer(labelMarkersDict[layer!.feature!.properties.id]);
      delete labelMarkersDict[layer!.feature!.properties.id];
    } else {
      // @ts-ignore
      map!.removeLayer(labelMarkersDict[layer._leaflet_id]);
      // @ts-ignore
      delete labelMarkersDict[layer._leaflet_id];
    }
    editableLayers.current!.removeLayer(layer!);

    setEditSpaceModalOpen(false);
  };

  const onFinish = (values: any) => {
    setSaveModalOpen(true);
    setFormValues(values);
  };

  const submitData = async (values: any) => {
    setIsSubmitting(true);
    const dataToSend = Object.assign(
      {},
      {
        floor: {
          level: values.floorLevel,
          name: values.floorName,
        },
      },
      editableLayers.current?.toGeoJSON(),
    );

    try {
      const response = await postEditFloorPlan(floorId, dataToSend);
      if (response.status === 200) {
        setUnsavedChanges(false);

        router.push(PAGE_ROUTES.floorPlanList);
        notification.open({
          type: "success",
          message: "Update successful",
          description: `Lantai ${values.floorName} has been updated.`,
        });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.data?.error?.message) {
        notification.open({
          type: "error",
          message: "Error submitting form",
          description: error.response.data.error.message,
        });
      } else {
        console.error(error);
        notification.open({
          type: "error",
          message: "Error submitting form",
          description: "An unexpected error occurred.",
        });
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed: ", errorInfo);
  };

  if (isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/4">
          {errorStatus && (
            <Alert
              message="Error fetching floor plan"
              description={errorMessage}
              type="error"
              showIcon
              className="rounded-none"
            />
          )}
          <div
            id="map"
            style={{
              position: "sticky",
              height: "88vh",
              background: "#F5F5F5",
            }}
            ref={mapDivRef}
          />
          <Button
            size="large"
            icon={<AimOutlined />}
            className="fixed left-3 bottom-3 border-2 flex justify-center items-center"
            onClick={() => mapLRef.current!.flyTo([0, 0], 0)}
          />
        </div>
        <div className="w-full lg:w-1/4 lg:max-h-[88vh] p-5 flex flex-col gap-5 lg:overflow-auto bg-white z-10">
          <div className="flex flex-col">
            <div className="flex justify-between items-center gap-5">
              <div className="flex items-center gap-3">
                <h3>Floor Plan</h3>
              </div>
              <Button
                type="link"
                className="flex items-center p-0"
                onClick={() => setTutorialModalOpen(true)}
              >
                <span className="underline">Tutorial</span>
                <QuestionCircleOutlined />
              </Button>
            </div>
            <Alert
              type="warning"
              message={`Changes won't be saved until the save button is clicked.`}
            />
          </div>
          <Form
            layout="vertical"
            form={floorPlanForm}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            disabled={isSubmitting || errorStatus}
          >
            <Form.Item
              label="Image Overlay"
              tooltip={{
                title:
                  "Display an image on the canvas to help with drawing. This image won't be saved.",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Card>
                <div className="flex flex-col gap-5">
                  <Tooltip title="Uploading a new image will replace the existing one">
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>
                        Upload New Image
                      </Button>
                    </Upload>
                  </Tooltip>
                  <div>
                    <span>Opacity:</span>
                    <Slider
                      min={0}
                      max={100}
                      step={10}
                      onChange={(value) => {
                        overlayRef.current?.setOpacity(value / 100);
                      }}
                      defaultValue={100}
                      marks={{ 0: "0", 100: "100%" }}
                      disabled={baseImageUrl ? false : true}
                    />
                  </div>
                </div>
              </Card>
            </Form.Item>
            <Form.Item
              label="Floor Level"
              tooltip={{
                title:
                  "Numerical position of floor within the building. It determines the sorting order of the floors.",
                icon: <InfoCircleOutlined />,
              }}
              name="floorLevel"
              rules={[{ required: true, message: "Please enter Floor Level" }]}
            >
              <InputNumber
                placeholder="0"
                className="w-full"
                onChange={() => setUnsavedChanges(true)}
              />
            </Form.Item>
            <Form.Item
              label="Floor Name"
              name="floorName"
              rules={[{ required: true }]}
            >
              <Input
                prefix="Lantai"
                placeholder="Dasar"
                className="w-full"
                allowClear
                onChange={() => setUnsavedChanges(true)}
              />
            </Form.Item>
            <Form.Item className="mt-10">
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <SpaceDetailModal
        title="Create Space"
        open={createSpaceModalOpen}
        onCancel={cancelCreateSpace}
        form={createSpaceForm}
        initialValues={{ ["category"]: "room" }}
        onFinish={createSpace}
        onFinishFailed={onFinishFailed}
        categoryValue={categoryValue}
      />

      <SpaceDetailModal
        title="Edit Space"
        open={editSpaceModalOpen}
        onCancel={cancelEditSpace}
        form={editSpaceForm}
        initialValues={{ ["category"]: "room" }}
        onFinish={editSpace}
        onFinishFailed={onFinishFailed}
        categoryValue={categoryValue}
        onDelete={deleteSpace}
        edit
      />

      <FpTutorialModal
        open={tutorialModalOpen}
        onCancel={() => setTutorialModalOpen(false)}
      />

      <ConfirmationModal
        title="Save Changes"
        open={saveModalOpen}
        onCancel={() => {
          setSaveModalOpen(false);
          setFormValues(null);
        }}
        okText="Save"
        onOk={() => submitData(formValues)}
        isSubmitting={isSubmitting}
      >
        Are you sure you want to save these changes?
      </ConfirmationModal>
    </>
  );
};

export default EditFloorPlanPage;
