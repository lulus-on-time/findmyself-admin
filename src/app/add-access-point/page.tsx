"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import CustomLayout from "@/components/layout/CustomLayout";
import { CopyOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, notification } from "antd";

const AddAccessPoint = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapData, setMapData] = useState({});
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

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

      var apIcon = L.icon({
        iconUrl: "/images/wifi.svg",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        tooltipAnchor: [12, 0],
      });

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: false,
          circle: false,
          circlemarker: false,
          rectangle: false,
          marker: {
            icon: apIcon,
          },
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

        editableLayers.addLayer(layer);
      });
    }
  }, []);

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
            <span className="font-bold text-lg">Add Access Point</span>
            <Button
              type="link"
              className="flex items-center p-0"
              onClick={() => setIsTutorialModalOpen(true)}
            >
              <span>Tutorial</span>
              <QuestionCircleOutlined />
            </Button>
          </div>
          <Form>
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
        onOk={() => setIsTutorialModalOpen(false)}
        onCancel={() => setIsTutorialModalOpen(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </CustomLayout>
  );
};

export default AddAccessPoint;
