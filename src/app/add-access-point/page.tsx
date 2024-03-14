"use client";

import React, { useEffect, useRef, useState } from "react";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import CustomLayout from "@/components/layout/CustomLayout";
import { CopyOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
} from "antd";
import { copyToClipboard } from "@/utils/helper";
import { apIcon, labelIcon } from "@/utils/constants";

const AddAccessPoint = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [apData, setApData] = useState({});
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

  useEffect(() => {
    const imgUrl = "/images/maps2.png";
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
      // L.imageOverlay(imgUrl, bounds).addTo(map);
      // @ts-ignore
      map.fitBounds(bounds);

      var roomGeoJSON = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              name: "Auditorium",
              centroid: [437.5478242066745, 151.99999999999997],
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [1, 299.093663],
                  [1, 576.001986],
                  [303, 576.001986],
                  [303, 299.093663],
                  [1, 299.093663],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: {
              name: "A3.01",
              centroid: [475.53524759869083, 401.99999999999994],
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [302, 375.068509],
                  [302, 576.001986],
                  [502, 576.001986],
                  [502, 375.068509],
                  [302, 375.068509],
                ],
              ],
            },
          },
        ],
      };

      // @ts-ignore
      function onEachFeature(feature: any, layer: any) {
        if (feature.properties && feature.properties.name) {
          // layer.bindTooltip(feature.properties.name, {
          //   permanent: true,
          //   direction: "center",
          // });
          L.marker(feature.properties.centroid, {
            icon: labelIcon(feature.properties.name),
          }).addTo(map);
        }

        layer.on("click", function (e: any) {
          map.doubleClickZoom.disable();
          var BSSID = prompt("Enter BSSID:");
          if (BSSID) {
            var roomName = layer.feature.properties.name;
            var marker = L.marker(e.latlng, {
              icon: apIcon,
            })
              .bindPopup(`${BSSID} in ${roomName}`)
              .addTo(editableLayers);

            marker.feature = {
              type: "Feature",
              properties: {
                bssid: BSSID,
                room: roomName,
              },
              geometry: marker.toGeoJSON().geometry,
            };

            setApData(editableLayers.toGeoJSON());
          }
        });
      }

      // @ts-ignore
      L.geoJSON(roomGeoJSON, {
        style: { opacity: 0 },
        onEachFeature: onEachFeature,
      }).addTo(map);

      var editableLayers = new L.FeatureGroup();
      map.addLayer(editableLayers);

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: false,
          circle: false,
          circlemarker: false,
          rectangle: false,
          marker: false,
        },
        edit: {
          featureGroup: editableLayers,
          remove: true,
          edit: false,
        },
      });
      map.addControl(drawControl);

      map.on("draw:deleted", function (e) {
        setApData(editableLayers.toGeoJSON());
      });
    }
  }, []);

  return (
    <CustomLayout>
      <div className="w-full flex">
        <div className="w-3/4">
          <Alert
            message="Click anywhere within the room (blue area) to add an access point"
            type="warning"
            closable
            showIcon
            className="rounded-none"
          />
          <div
            id="map"
            style={{
              position: "sticky",
              height: "89vh",
              width: "100%",
              background: "#F5F5F5",
            }}
            ref={mapRef}
          />
        </div>
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
            <div className="mb-2">GeoJSON Example:</div>
            <Form.Item className="bg-[#F5F5F5] rounded-lg">
              <div className="absolute w-full flex justify-end">
                <Button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(apData, null, 2))
                  }
                >
                  <CopyOutlined />
                </Button>
              </div>
              <pre className="px-3">{JSON.stringify(apData, null, 2)}</pre>
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
