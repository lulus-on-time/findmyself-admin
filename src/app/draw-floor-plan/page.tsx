"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import CustomLayout from "@/components/layout/CustomLayout";
import {
  CopyOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Upload, notification } from "antd";
import { copyToClipboard } from "@/utils/helper";
import type { UploadProps } from "antd";

const DrawFloorPlan = () => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapLRef = useRef<L.Map | null>(null);

  const [baseImageUrl, setBaseImageUrl] = useState<string | null>("");
  const [roomData, setRoomData] = useState({});
  const [floorPlanData, setFloorPlanData] = useState({});

  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [roomNameModalOpen, setRoomNameModalOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    // @ts-ignore
    if (mapDivRef.current && !mapDivRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
      });

      map.fitBounds([
        [0, 0],
        [1000, 1000],
      ]);

      map.zoomControl.setPosition("bottomright");

      var editableLayers = new L.FeatureGroup();
      map.addLayer(editableLayers);

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e1e100",
              message: "<strong>Oh snap!<strong> You can't draw that!",
            },
          },
          circle: false,
          circlemarker: false,
          rectangle: {},
          marker: false,
        },
        edit: {
          featureGroup: editableLayers,
          remove: true,
          edit: false,
        },
      });
      map.addControl(drawControl);

      map.on("draw:created", function (e) {
        var type = (e as L.DrawEvents.Created).layerType,
          layer = (e as L.DrawEvents.Created).layer;

        var roomName = prompt("Enter room name:");

        if (roomName) {
          layer.bindTooltip(roomName, {
            permanent: true,
            direction: "center",
          });

          editableLayers.addLayer(layer);

          var centroid = (layer as L.Polygon).getCenter();

          layer.feature = {
            type: "Feature",
            properties: {
              name: roomName,
              centroid: [centroid.lat, centroid.lng],
            },
            geometry: layer.toGeoJSON().geometry,
          };

          setRoomData(editableLayers.toGeoJSON());
        }

        layer.on("dblclick", function () {
          map.doubleClickZoom.disable();
          roomName = prompt("Enter new room name:");
          if (roomName) {
            layer.setTooltipContent(roomName);
            if (layer.feature?.properties && layer.feature.properties.name) {
              layer.feature.properties.name = roomName;
            }
            setRoomData(editableLayers.toGeoJSON());
          }
        });
      });

      map.on("draw:deleted", function (e) {
        setRoomData(editableLayers.toGeoJSON());
      });

      mapLRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (baseImageUrl && mapLRef.current) {
      const baseImage = new Image();
      baseImage.src = baseImageUrl;

      baseImage.onload = () => {
        var bounds = [
          [0, 0],
          [baseImage.height, baseImage.width],
        ];

        // @ts-ignore
        L.imageOverlay(baseImageUrl, bounds).addTo(mapLRef.current!);
        // @ts-ignore
        mapLRef.current!.fitBounds(bounds);
      };

      baseImage.onerror = (error) => {
        notification.open({
          message: "Error loading image:" + error,
        });
      };
    }
  }, [baseImageUrl]);

  const props: UploadProps = {
    name: "file",
    accept: ".png, .jpg, .jpeg, .webp",
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

  return (
    <CustomLayout>
      <div className="w-full flex">
        <div
          id="map"
          style={{
            position: "sticky",
            height: "89vh",
            width: "75%",
            background: "#F5F5F5",
          }}
          ref={mapDivRef}
        />
        <div className="w-1/4 max-h-[89vh] p-5 flex flex-col gap-5 overflow-auto">
          <div className="flex justify-between items-center gap-5">
            <span className="font-bold text-lg">Draw Floor Plan</span>
            <Button
              type="link"
              className="flex items-center p-0"
              onClick={() => setTutorialModalOpen(true)}
            >
              <span>Tutorial</span>
              <QuestionCircleOutlined />
            </Button>
          </div>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Add Image Overlay</Button>
          </Upload>
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Floor Name"
              name="floorName"
              rules={[{ required: true }]}
            >
              <Input prefix="Lantai" placeholder="Dasar" className="w-full" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setFloorPlanData(
                    Object.assign({}, form.getFieldsValue(), roomData),
                  );
                }}
              >
                Save
              </Button>
            </Form.Item>
          </Form>

          {/* DEV ONLY */}
          <span>Result</span>
          <div className="bg-[#F5F5F5] rounded-lg">
            <pre className="px-3">{JSON.stringify(floorPlanData, null, 2)}</pre>
          </div>
          <Button
            onClick={() =>
              copyToClipboard(JSON.stringify(floorPlanData, null, 2))
            }
          >
            Copy JSON
            <CopyOutlined />
          </Button>
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
        title="Room Name"
        open={roomNameModalOpen}
        onOk={() => setRoomNameModalOpen(false)}
        onCancel={() => setRoomNameModalOpen(false)}
      >
        <Input placeholder="Enter room name" />
      </Modal>
    </CustomLayout>
  );
};

export default DrawFloorPlan;
