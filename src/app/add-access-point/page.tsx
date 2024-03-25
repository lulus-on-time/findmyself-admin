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
    const imgSize = [60, 118];

    // @ts-ignore
    if (mapRef.current && !mapRef.current._leaflet_id) {
      var map = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 10,
      });

      map.zoomControl.setPosition("bottomright");

      var bounds = [[0, 0], imgSize];

      // @ts-ignore
      // L.imageOverlay(imgUrl, bounds).addTo(map);
      // @ts-ignore
      map.fitBounds(bounds);

      // var roomGeoJSON = {
      //   type: "FeatureCollection",
      //   features: [
      //     {
      //       type: "Feature",
      //       properties: {
      //         name: "Auditorium",
      //         centroid: [437.5478242066745, 151.99999999999997],
      //       },
      //       geometry: {
      //         type: "Polygon",
      //         coordinates: [
      //           [
      //             [1, 299.093663],
      //             [1, 576.001986],
      //             [303, 576.001986],
      //             [303, 299.093663],
      //             [1, 299.093663],
      //           ],
      //         ],
      //       },
      //     },
      //     {
      //       type: "Feature",
      //       properties: {
      //         name: "A3.01",
      //         centroid: [475.53524759869083, 401.99999999999994],
      //       },
      //       geometry: {
      //         type: "Polygon",
      //         coordinates: [
      //           [
      //             [302, 375.068509],
      //             [302, 576.001986],
      //             [502, 576.001986],
      //             [502, 375.068509],
      //             [302, 375.068509],
      //           ],
      //         ],
      //       },
      //     },
      //   ],
      // };

      var roomGeoJSON = {
        type: "FeatureCollection",
        creator: "svg2geojson v0.7.0",
        name: "Maps",
        features: [
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [31.320643, 59.947871],
                  [31.320643, 59.947871],
                  [31.320643, 39.096438],
                  [50.456102, 39.096438],
                  [50.456102, 59.947871],
                  [31.320643, 59.947871],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [50.456102, 59.947871],
                  [50.503861, 59.947871],
                  [50.503861, 60.0],
                  [50.456102, 60.0],
                  [50.456102, 59.947871],
                  [50.456102, 59.947871],
                ],
                [
                  [50.456102, 39.096438],
                  [50.456102, 39.096438],
                  [50.503861, 39.096438],
                  [50.503861, 39.044309],
                  [50.456102, 39.044309],
                  [50.456102, 39.096438],
                ],
                [
                  [31.320643, 59.895743],
                  [31.320643, 59.895743],
                  [31.320643, 60.0],
                  [50.456102, 60.0],
                  [50.456102, 59.895743],
                  [31.320643, 59.895743],
                ],
                [
                  [50.408343, 59.947871],
                  [50.408343, 59.947871],
                  [50.503861, 59.947871],
                  [50.503861, 39.096438],
                  [50.408343, 39.096438],
                  [50.408343, 59.947871],
                ],
                [
                  [50.456102, 39.148566],
                  [50.456102, 39.148566],
                  [50.456102, 39.044309],
                  [31.320643, 39.044309],
                  [31.320643, 39.148566],
                  [50.456102, 39.148566],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [2.617406, 59.947871],
                  [2.617406, 31.27715],
                  [31.320643, 31.27715],
                  [31.320643, 59.947871],
                  [2.617406, 59.947871],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [88.727116, 59.947871],
                  [88.727116, 39.096438],
                  [117.430353, 39.096438],
                  [117.430353, 59.947871],
                  [88.727116, 59.947871],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [98.295181, 28.670721],
                  [98.295181, 28.670721],
                  [98.295181, 0.0],
                  [117.430353, 0.0],
                  [117.430353, 28.670721],
                  [98.295181, 28.670721],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [117.430353, 0.0],
                  [117.430353, -0.052129],
                  [117.478113, -0.052129],
                  [117.478113, 0.0],
                  [117.430353, 0.0],
                  [117.430353, 0.0],
                ],
                [
                  [98.295181, 0.0],
                  [98.295181, 0.0],
                  [98.295181, -0.052129],
                  [98.247421, -0.052129],
                  [98.247421, 0.0],
                  [98.295181, 0.0],
                ],
                [
                  [117.382594, 28.670721],
                  [117.382594, 28.670721],
                  [117.478113, 28.670721],
                  [117.478113, 0.0],
                  [117.382594, 0.0],
                  [117.382594, 28.670721],
                ],
                [
                  [117.430353, 0.052129],
                  [117.430353, 0.052129],
                  [117.430353, -0.052129],
                  [98.295181, -0.052129],
                  [98.295181, 0.052129],
                  [117.430353, 0.052129],
                ],
                [
                  [98.34294, 0.0],
                  [98.34294, 0.0],
                  [98.247421, 0.0],
                  [98.247421, 28.670721],
                  [98.34294, 28.670721],
                  [98.34294, 0.0],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [69.591657, 28.670721],
                  [69.591657, 0.0],
                  [98.294894, 0.0],
                  [98.294894, 28.670721],
                  [69.591657, 28.670721],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [21.752865, 0.052129],
                  [12.185183, 0.052129],
                  [12.185183, -0.052129],
                  [21.752865, -0.052129],
                  [21.752865, 0.052129],
                  [21.752865, 0.052129],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [31.320643, 13.032146],
                  [31.320643, 7.819288],
                  [40.88842, 7.819288],
                  [40.88842, 13.032146],
                  [31.320643, 13.032146],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [69.591657, 59.947871],
                  [69.591657, 39.096438],
                  [88.727116, 39.096438],
                  [88.727116, 59.947871],
                  [69.591657, 59.947871],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [50.456102, 59.947871],
                  [50.456102, 39.096438],
                  [69.591562, 39.096438],
                  [69.591562, 59.947871],
                  [50.456102, 59.947871],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [31.320643, 23.457863],
                  [31.320643, 13.032146],
                  [40.88842, 13.032146],
                  [40.88842, 23.457863],
                  [31.320643, 23.457863],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [31.368402, 23.457863],
                  [31.368402, 39.096438],
                  [31.272884, 39.096438],
                  [31.272884, 23.457863],
                  [31.368402, 23.457863],
                  [31.368402, 23.457863],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [12.185183, 23.457863],
                  [12.185183, 23.457863],
                  [12.185183, 13.032146],
                  [21.752865, 13.032146],
                  [21.752865, 23.457863],
                  [12.185183, 23.457863],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [21.752865, 23.457863],
                  [21.800624, 23.457863],
                  [21.800624, 23.509991],
                  [21.752865, 23.509991],
                  [21.752865, 23.457863],
                  [21.752865, 23.457863],
                ],
                [
                  [21.752865, 13.032146],
                  [21.752865, 13.032146],
                  [21.800624, 13.032146],
                  [21.800624, 12.980017],
                  [21.752865, 12.980017],
                  [21.752865, 13.032146],
                ],
                [
                  [12.185183, 23.405734],
                  [12.185183, 23.405734],
                  [12.185183, 23.509991],
                  [21.752865, 23.509991],
                  [21.752865, 23.405734],
                  [12.185183, 23.405734],
                ],
                [
                  [21.705106, 23.457863],
                  [21.705106, 23.457863],
                  [21.800624, 23.457863],
                  [21.800624, 13.032146],
                  [21.705106, 13.032146],
                  [21.705106, 23.457863],
                ],
                [
                  [21.752865, 13.084275],
                  [21.752865, 13.084275],
                  [21.752865, 12.980017],
                  [12.185183, 12.980017],
                  [12.185183, 13.084275],
                  [21.752865, 13.084275],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [40.88842, 28.670721],
                  [40.88842, 5.212858],
                  [50.456198, 5.212858],
                  [50.456198, 28.670721],
                  [40.88842, 28.670721],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [50.456102, 28.670721],
                  [50.456102, 28.670721],
                  [50.456102, 0.0],
                  [69.591657, 0.0],
                  [69.591657, 28.670721],
                  [50.456102, 28.670721],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [69.591657, 28.670721],
                  [69.639416, 28.670721],
                  [69.639416, 28.72285],
                  [69.591657, 28.72285],
                  [69.591657, 28.670721],
                  [69.591657, 28.670721],
                ],
                [
                  [69.591657, 0.0],
                  [69.591657, 0.0],
                  [69.639416, 0.0],
                  [69.639416, -0.052129],
                  [69.591657, -0.052129],
                  [69.591657, 0.0],
                ],
                [
                  [50.456102, 28.618593],
                  [50.456102, 28.618593],
                  [50.456102, 28.72285],
                  [69.591657, 28.72285],
                  [69.591657, 28.618593],
                  [50.456102, 28.618593],
                ],
                [
                  [69.543898, 28.670721],
                  [69.543898, 28.670721],
                  [69.639416, 28.670721],
                  [69.639416, 0.0],
                  [69.543898, 0.0],
                  [69.543898, 28.670721],
                ],
                [
                  [69.591657, 0.052129],
                  [69.591657, 0.052129],
                  [69.591657, -0.052129],
                  [50.456102, -0.052129],
                  [50.456102, 0.052129],
                  [69.591657, 0.052129],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [40.88842, 5.212858],
                  [40.88842, 5.212858],
                  [40.88842, 0.0],
                  [50.456198, 0.0],
                  [50.456198, 5.212858],
                  [40.88842, 5.212858],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [40.88842, 5.212858],
                  [40.88842, 5.264987],
                  [40.840661, 5.264987],
                  [40.840661, 5.212858],
                  [40.88842, 5.212858],
                  [40.88842, 5.212858],
                ],
                [
                  [40.88842, 0.0],
                  [40.88842, 0.0],
                  [40.88842, -0.052129],
                  [40.840661, -0.052129],
                  [40.840661, 0.0],
                  [40.88842, 0.0],
                ],
                [
                  [40.88842, 5.16073],
                  [40.88842, 5.16073],
                  [40.88842, 5.264987],
                  [50.456198, 5.264987],
                  [50.456198, 5.16073],
                  [40.88842, 5.16073],
                ],
                [
                  [50.456198, 0.052129],
                  [50.456198, 0.052129],
                  [50.456198, -0.052129],
                  [40.88842, -0.052129],
                  [40.88842, 0.052129],
                  [50.456198, 0.052129],
                ],
                [
                  [40.936179, 0.0],
                  [40.936179, 0.0],
                  [40.840661, 0.0],
                  [40.840661, 5.212858],
                  [40.936179, 5.212858],
                  [40.936179, 0.0],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [12.185183, 13.032146],
                  [12.185183, 7.819288],
                  [21.752961, 7.819288],
                  [21.752961, 13.032146],
                  [12.185183, 13.032146],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [31.320643, 5.212858],
                  [31.320643, 0.0],
                  [40.88842, 0.0],
                  [40.88842, 5.212858],
                  [31.320643, 5.212858],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [21.752865, 5.212858],
                  [21.752865, 0.0],
                  [31.320643, 0.0],
                  [31.320643, 5.212858],
                  [21.752865, 5.212858],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { properties: null },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [21.752865, 23.457863],
                  [21.752865, 13.032146],
                  [31.320643, 13.032146],
                  [31.320643, 23.457863],
                  [21.752865, 23.457863],
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
        // style: { opacity: 0 },
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
