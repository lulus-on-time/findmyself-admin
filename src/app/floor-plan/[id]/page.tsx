"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import CustomLayout from "@/components/layout/CustomLayout";
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Switch,
  Tooltip,
  Upload,
  notification,
} from "antd";
import type { UploadProps } from "antd";
import { spaceLabelIcon } from "@/components/icons/marker";
import { getFloorPlanDetail } from "@/services/floorPlan";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/config/constants";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import SpaceDetailModal from "@/components/modals/CreateSpaceModal";
import FpTutorialModal from "@/components/modals/FpTutorialModal";
import { LabelMarkers } from "../type";

const EditFloorPlanPage = ({ params }: { params: { id: any } }) => {
  const floorId = params.id;
  const router = useRouter();
  // useRef
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapLRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.ImageOverlay | null>(null);
  const editableLayers = useRef<L.FeatureGroup | null>(null);
  const globalLayer = useRef<L.Polygon | null>(null);
  const drawControlRef = useRef<any>(null);
  //
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>("");
  const [categoryValue] = useState("room");
  const [labelMarkersDict] = useState<LabelMarkers>({});
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  // Modal
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);
  const [editSpaceModalOpen, setEditSpaceModalOpen] = useState(false);
  // Form
  const [createSpaceForm] = Form.useForm();
  const [editSpaceForm] = Form.useForm();
  const [floorPlanForm] = Form.useForm();
  // Service
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  var floorPlanData: any = null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await getFloorPlanDetail(floorId);
      floorPlanData = response.data;
      initMap();
      setIsFetching(false);
    } catch (error: any) {
      setErrorStatus(true);
      setErrorMessage(error.toString());
      setIsFetching(false);
    }
  };

  const initMap = () => {
    floorPlanForm.setFieldValue("floorLevel", floorPlanData.floor.level);
    floorPlanForm.setFieldValue("floorName", floorPlanData.floor.name);

    // @ts-ignore
    if (mapDivRef.current && !mapDivRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -10,
        maxZoom: 10,
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
          layer.setStyle({ fillColor: "lightblue", color: "white" });
        } else {
          layer.setStyle({ fillColor: "cadetblue", color: "white" });
        }

        var labelMarker = L.marker(feature.properties.poi, {
          draggable: true,
          icon: spaceLabelIcon(feature.properties.name),
        }).addTo(map);
        labelMarkersDict[feature.properties.id] = labelMarker;

        labelMarker.on("dragend", function () {
          if (
            !(layer as L.Polygon).getBounds().contains(labelMarker.getLatLng())
          ) {
            labelMarker.setLatLng(feature.properties.poi);
            return;
          }
          var poi = labelMarker.getLatLng();
          layer!.feature!.properties.poi = [poi.lat, poi.lng];
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
          remove: true,
          edit: false,
        },
      });
      drawControlRef.current = drawControl;

      map.on("draw:created", function (e) {
        const layer = (e as L.DrawEvents.Created).layer;
        // @ts-ignore
        globalLayer.current = layer;
        editableLayers.current!.addLayer(layer!);

        setCreateSpaceModalOpen(true);
      });

      map.on("draw:deleted", function (e) {
        // @ts-ignore
        var deletedLayers = e.layers;
        deletedLayers.eachLayer(function (layer: any) {
          if (layer.feature.properties.id) {
            map.removeLayer(labelMarkersDict[layer.feature.properties.id]);
            delete labelMarkersDict[layer.feature.properties.id];
          } else {
            map.removeLayer(labelMarkersDict[layer._leaflet_id]);
            delete labelMarkersDict[layer._leaflet_id];
          }
        });
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
    var category = values.category;
    var spaceName = values.spaceName;

    var map = mapLRef.current;
    var layer = globalLayer.current;

    var poi = (layer as L.Polygon).getBounds().getCenter();
    var labelMarker = L.marker(poi, {
      draggable: true,
      icon: spaceLabelIcon(spaceName),
    }).addTo(map!);
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
      if (!(layer as L.Polygon).getBounds().contains(labelMarker.getLatLng())) {
        labelMarker.setLatLng(poi);
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

    setCreateSpaceModalOpen(false);
    createSpaceForm.resetFields();
  };

  const editSpace = (values: any) => {
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

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    const dataToSend = Object.assign(
      {},
      {
        floor: {
          id: floorId,
          level: values.floorLevel,
          name: values.floorName,
        },
      },
      editableLayers.current?.toGeoJSON(),
    );
    console.log(JSON.stringify(dataToSend, null, 2));

    // try {
    //   const response = await postCreateFloorPlan(dataToSend);
    //   if (response.status === 200) {
    //     router.push(PAGE_ROUTES.floorPlanList);
    //   }
    // } catch (error: any) {
    //   setIsSubmitting(false);
    //   if (error.response?.data?.error?.message) {
    //     notification.open({
    //       type: "error",
    //       message: "Error submitting form",
    //       description: error.response.data.error.message,
    //     });
    //   } else {
    //     console.error(error);
    //     notification.open({
    //       type: "error",
    //       message: "Error submitting form",
    //       description: "An unexpected error occurred.",
    //     });
    //   }
    // }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed: ", errorInfo);
  };

  if (isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <CustomLayout>
      <div className="w-full flex flex-col md:flex-row">
        <div
          id="map"
          style={{
            position: "sticky",
            height: "88vh",
            background: "#F5F5F5",
          }}
          ref={mapDivRef}
          className="w-full md:w-3/4"
        />
        <div className="w-full md:w-1/4 max-h-[90vh] p-5 flex flex-col gap-5 overflow-auto">
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center gap-3">
              <Switch
                onChange={(checked: boolean) => {
                  setAllowEdit(checked);
                  if (checked) {
                    mapLRef.current?.addControl(drawControlRef.current);
                  } else {
                    mapLRef.current?.removeControl(drawControlRef.current);
                  }
                }}
              />
              <h3>Edit Floor Plan</h3>
            </div>
            <Button
              type="link"
              className="flex items-center p-0"
              onClick={() => setTutorialModalOpen(true)}
            >
              <span>Tutorial</span>
              <QuestionCircleOutlined />
            </Button>
          </div>
          <Form
            layout="vertical"
            form={floorPlanForm}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            disabled={isSubmitting || !allowEdit}
          >
            <Form.Item>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Add Image Overlay</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label={
                <div className="flex gap-2 items-center">
                  <span>Floor Level</span>
                  <Tooltip title="Numerical position of floor within the building. It determines the sorting order of the floors.">
                    <InfoCircleOutlined style={{ color: "#a6a6a6" }} />
                  </Tooltip>
                </div>
              }
              name="floorLevel"
              rules={[{ required: true, message: "Please enter Floor Level" }]}
            >
              <InputNumber placeholder="0" className="w-full" />
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
      />

      <FpTutorialModal
        open={tutorialModalOpen}
        onOk={() => setTutorialModalOpen(false)}
        onCancel={() => setTutorialModalOpen(false)}
      />
    </CustomLayout>
  );
};

export default EditFloorPlanPage;
