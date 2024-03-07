"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import CustomLayout from "@/components/layout/CustomLayout";
import { CopyOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification } from "antd";

const DrawFloorPlan = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapData, setMapData] = useState({});
  const [isTutorialModalOpen, setisTutorialModalOpen] = useState(false);
  // const [isRoomNameModalOpen, setisRoomNameModalOpen] = useState(false);
  // const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const imgUrl = "/images/maps.png";
    const imgSize = [577, 1204];

    // @ts-ignore
    if (mapRef.current && !mapRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
      });

      map.zoomControl.setPosition("bottomright");

      var bounds = [[0, 0], imgSize];

      // @ts-ignore
      L.imageOverlay(imgUrl, bounds).addTo(map);
      // @ts-ignore
      map.fitBounds(bounds);

      var editableLayers = new L.FeatureGroup();
      map.addLayer(editableLayers);

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e1e100",
              message: "<strong>Oh snap!<strong> you can't draw that!",
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
              centroid: [centroid.lng, centroid.lat],
            },
            geometry: layer.toGeoJSON().geometry,
          };

          setMapData(editableLayers.toGeoJSON());
        }

        layer.on("dblclick", function () {
          map.doubleClickZoom.disable();
          roomName = prompt("Enter new room name:");
          if (roomName) {
            layer.setTooltipContent(roomName);
            if (layer.feature?.properties && layer.feature.properties.name) {
              layer.feature.properties.name = roomName;
            }
            setMapData(editableLayers.toGeoJSON());
          }
        });
      });

      map.on("draw:deleted", function (e) {
        setMapData(editableLayers.toGeoJSON());
      });
    }
  }, []);

  // temp
  function copyToClipboard(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          notification.open({
            message: "Text copied to clipboard",
          });
          resolve();
        })
        .catch((err) => {
          notification.open({
            message: "Failed to copy text to clipboard:" + err,
          });
          reject(err);
        });
    });
  }

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
          ref={mapRef}
        />
        <div className="w-1/4 max-h-[89vh] p-5 flex flex-col gap-5 overflow-auto">
          <div className="flex justify-between items-center gap-5">
            <span className="font-bold text-lg">Draw Floor Plan</span>
            <Button
              type="link"
              className="flex items-center p-0"
              onClick={() => setisTutorialModalOpen(true)}
            >
              <span>Tutorial</span>
              <QuestionCircleOutlined />
            </Button>
          </div>
          <Form>
            <Form.Item
              label="Floor Level"
              name="floor"
              rules={[{ required: true, message: "Please input floor level" }]}
            >
              <Input />
            </Form.Item>
            <div className="mb-2">GeoJSON Example: (for dev only)</div>
            <Form.Item className="bg-[#F5F5F5] rounded-lg">
              <div className="absolute w-full flex justify-end">
                <Button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(mapData, null, 2))
                  }
                >
                  <CopyOutlined />
                </Button>
              </div>
              <pre className="px-3">{JSON.stringify(mapData, null, 2)}</pre>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title="Tutorial"
        open={isTutorialModalOpen}
        onOk={() => setisTutorialModalOpen(false)}
        onCancel={() => setisTutorialModalOpen(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>

      {/* <Modal
        title="Room Name"
        open={isRoomNameModalOpen}
        onOk={() => setisRoomNameModalOpen(false)}
        onCancel={() => setisRoomNameModalOpen(false)}
      >
        <Input placeholder="Enter room name" />
      </Modal> */}
    </CustomLayout>
  );
};

export default DrawFloorPlan;
