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
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Upload,
  message,
  notification,
} from "antd";
import type { UploadProps } from "antd";
import { spaceLabelIcon } from "@/components/icons/marker";
import { postCreateFloorPlan } from "@/services/floorPlan";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/config/constants";
import { LabelMarkers } from "../type";
import FpTutorialModal from "@/components/modals/FpTutorialModal";
import SpaceDetailModal from "@/components/modals/SpaceDetailModal";
import { isMarkerInsidePolygon } from "@/utils/helper";

const CreateFloorPlanPage = () => {
  const router = useRouter();
  // Map
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapLRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.ImageOverlay | null>(null);
  const editableLayers = useRef<L.FeatureGroup | null>(null);
  const globalLayer = useRef<L.Polygon | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>("");
  const [categoryValue] = useState("room");
  const [labelMarkersDict] = useState<LabelMarkers>({});
  const [deleteWarning, setDeleteWarning] = useState<boolean>(false);
  // Service
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);
  const [editSpaceModalOpen, setEditSpaceModalOpen] = useState(false);
  // Form
  const [createSpaceForm] = Form.useForm();
  const [editSpaceForm] = Form.useForm();

  useEffect(() => {
    // @ts-ignore
    if (mapDivRef.current && !mapDivRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -10,
        maxZoom: 10,
      });
      map.fitBounds([
        [0, 0],
        [2000, 2000],
      ]);
      map.zoomControl.setPosition("bottomright");

      editableLayers.current = new L.FeatureGroup();
      map.addLayer(editableLayers.current);

      var drawControl = new L.Control.Draw({
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

      map.on("draw:deleted", function (e) {
        // @ts-ignore
        var deletedLayers = e.layers;
        deletedLayers.eachLayer(function (layer: any) {
          map.removeLayer(labelMarkersDict[layer._leaflet_id]);
          delete labelMarkersDict[layer._leaflet_id];
        });
      });

      map.on("draw:deletestart", function () {
        setDeleteWarning(true);
      });

      map.on("draw:deletestop", function () {
        setDeleteWarning(false);
      });

      mapLRef.current = map;
    }
  }, [labelMarkersDict]);

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

      editSpaceForm.setFieldsValue({
        category: layer!.feature!.properties.category,
        spaceName: layer!.feature!.properties.name,
      });
    });

    if (category === "corridor") {
      layer!.setStyle({ fillColor: "lightblue", color: "white", opacity: 1 });
    } else {
      layer!.setStyle({ fillColor: "cadetblue", color: "white", opacity: 1 });
    }

    setCreateSpaceModalOpen(false);
    createSpaceForm.resetFields();
  };

  const editSpace = (values: any) => {
    var category = values.category;
    var spaceName = values.spaceName;

    var layer = globalLayer.current;
    // @ts-ignore
    var labelMarker = labelMarkersDict[layer._leaflet_id];
    labelMarker.setIcon(spaceLabelIcon(spaceName));
    layer!.feature!.properties.category = category;
    layer!.feature!.properties.name = spaceName;

    if (category === "corridor") {
      layer!.setStyle({ fillColor: "lightblue", color: "white", opacity: 1 });
    } else {
      layer!.setStyle({ fillColor: "cadetblue", color: "white", opacity: 1 });
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

  const onFinish = async (values: any) => {
    setIsLoading(true);
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
      const response = await postCreateFloorPlan(dataToSend);
      if (response.status === 200) {
        router.push(PAGE_ROUTES.floorPlanList);
        notification.open({
          type: "success",
          message: "Creation successful",
          description: `Lantai ${values.floorName} has been created.`,
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.response?.data?.error?.message) {
        notification.open({
          type: "error",
          message: "Error submitting form",
          description: error.response.data.error.message,
          duration: 0,
        });
      } else {
        console.error(error);
        notification.open({
          type: "error",
          message: "Error submitting form",
          description: "An unexpected error occurred.",
          duration: 0,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed: ", errorInfo);
  };

  return (
    <CustomLayout>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-3/4">
          {deleteWarning && (
            <Alert
              type="warning"
              showIcon
              message="Caution: Deleting a room cannot be undone."
              closable
              onClose={() => setDeleteWarning(false)}
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
        </div>
        <div className="w-full md:w-1/4 max-h-[90vh] p-5 flex flex-col gap-5 overflow-auto">
          <div className="flex justify-between items-center gap-5">
            <h3>Create Floor Plan</h3>
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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            disabled={isLoading}
          >
            <Form.Item>
              <Tooltip title="Display an image on the canvas to help with drawing. This image won't be saved.">
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Add Image Overlay</Button>
                </Upload>
              </Tooltip>
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
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Submit
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

export default CreateFloorPlanPage;
