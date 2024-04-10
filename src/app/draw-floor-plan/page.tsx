"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import CustomLayout from "@/components/layout/CustomLayout";
import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Upload,
  notification,
} from "antd";
import type { UploadProps } from "antd";
import { labelIcon } from "@/utils/constants";

interface LabelMarkers {
  [key: string]: L.Marker;
}

const DrawFloorPlan = () => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapLRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.ImageOverlay | null>(null);
  const editableLayers = useRef<L.FeatureGroup | null>(null);
  const globalLayer = useRef<L.Polygon | null>(null);

  const [baseImageUrl, setBaseImageUrl] = useState<string | null>("");
  const [categoryValue, setCategoryValue] = useState("room");
  const [labelMarkersDict, setLabelMarkersDict] = useState<LabelMarkers>({});

  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);
  const [editSpaceModalOpen, setEditSpaceModalOpen] = useState(false);

  const [floorPlanForm] = Form.useForm();
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
      map.addControl(drawControl);

      map.on("draw:created", function (e) {
        const layer = (e as L.DrawEvents.Created).layer;
        // @ts-ignore
        globalLayer.current = layer;

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
          message: "Error loading image. Please try again.",
        });
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

  function createSpace() {
    createSpaceForm
      .validateFields()
      .then((values) => {
        var category = values.category;
        var spaceName = values.spaceName;

        var map = mapLRef.current;
        var layer = globalLayer.current;
        // @ts-ignore
        editableLayers.current!.addLayer(layer!);

        var poi = (layer as L.Polygon).getBounds().getCenter();
        var labelMarker = L.marker(poi, {
          draggable: true,
          icon: labelIcon(spaceName),
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
          if (
            !(layer as L.Polygon).getBounds().contains(labelMarker.getLatLng())
          ) {
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
          editSpaceForm.setFieldValue(
            "spaceName",
            layer!.feature!.properties.name,
          );
        });

        setCreateSpaceModalOpen(false);
        createSpaceForm.resetFields();
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo); // TODO
      });
  }

  function editSpace() {
    editSpaceForm
      .validateFields()
      .then((values) => {
        var category = values.category;
        var spaceName = values.spaceName;

        var layer = globalLayer.current;
        // @ts-ignore
        var labelMarker = labelMarkersDict[layer._leaflet_id];
        labelMarker.setIcon(labelIcon(spaceName));
        layer!.feature!.properties.category = category;
        layer!.feature!.properties.name = spaceName;

        setEditSpaceModalOpen(false);
        editSpaceForm.resetFields();
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo); // TODO
      });
  }

  function cancelCreateSpace() {
    setCreateSpaceModalOpen(false);
    createSpaceForm.resetFields();
  }

  function cancelEditSpace() {
    setEditSpaceModalOpen(false);
    editSpaceForm.resetFields();
  }

  return (
    <CustomLayout>
      <div className="w-full flex flex-col lg:flex-row">
        <div
          id="map"
          style={{
            position: "sticky",
            height: "88vh",
            background: "#F5F5F5",
          }}
          ref={mapDivRef}
          className="w-full lg:w-3/4"
        />
        <div className="w-full lg:w-1/4 max-h-[90vh] p-5 flex flex-col gap-5 overflow-auto">
          <div className="flex justify-between items-center gap-5">
            <h3>Draw Floor Plan</h3>
            <Button
              type="link"
              className="flex items-center p-0"
              onClick={() => setTutorialModalOpen(true)}
            >
              <span>Tutorial</span>
              <QuestionCircleOutlined />
            </Button>
          </div>
          <Form layout="vertical" form={floorPlanForm}>
            <Form.Item>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Add Image Overlay</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Floor Level"
              name="floorLevel"
              rules={[{ required: true }]}
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
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  floorPlanForm
                    .validateFields()
                    .then((values) => {
                      var data = Object.assign(
                        {},
                        {
                          floor: {
                            level: values.floorLevel,
                            name: values.floorName,
                          },
                        },
                        editableLayers.current?.toGeoJSON(),
                      );
                      console.log(JSON.stringify(data, null, 2));
                    })
                    .catch((errorInfo) => {
                      console.log("Validation failed:", errorInfo); // TODO
                    });
                }}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <Modal
        title="Tutorial"
        open={tutorialModalOpen}
        onOk={() => setTutorialModalOpen(false)}
        onCancel={() => setTutorialModalOpen(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>

      <Modal
        title="Create Space"
        open={createSpaceModalOpen}
        onOk={createSpace}
        onCancel={cancelCreateSpace}
      >
        <Form
          layout="vertical"
          className="mt-5"
          form={createSpaceForm}
          initialValues={{ ["category"]: "room" }}
        >
          <Form.Item label="Type" name="category" rules={[{ required: true }]}>
            <Radio.Group value={categoryValue}>
              <Radio value="room">Room</Radio>
              <Radio value="corridor">Corridor</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Name" name="spaceName" rules={[{ required: true }]}>
            <Input placeholder="AX.0Y" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Space"
        open={editSpaceModalOpen}
        onOk={editSpace}
        onCancel={cancelEditSpace}
      >
        <Form
          layout="vertical"
          className="mt-5"
          form={editSpaceForm}
          initialValues={{ ["category"]: "room" }}
        >
          <Form.Item label="Type" name="category" rules={[{ required: true }]}>
            <Radio.Group value={categoryValue}>
              <Radio value="room">Room</Radio>
              <Radio value="corridor">Corridor</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Name" name="spaceName" rules={[{ required: true }]}>
            <Input placeholder="AX.0Y" />
          </Form.Item>
        </Form>
      </Modal>
    </CustomLayout>
  );
};

export default DrawFloorPlan;
