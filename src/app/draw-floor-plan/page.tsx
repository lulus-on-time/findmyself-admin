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
import { copyToClipboard } from "@/utils/helper";

const DrawFloorPlan = () => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapLRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.ImageOverlay | null>(null);

  const [baseImageUrl, setBaseImageUrl] = useState<string | null>("");
  const [geoData, setGeoData] = useState({});
  const [floorPlanData, setFloorPlanData] = useState({});

  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [spacePropModalOpen, setSpacePropModalOpen] = useState(false);

  const [form] = Form.useForm();

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

      var editableLayers = new L.FeatureGroup();
      map.addLayer(editableLayers);

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              // TODO
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

      var labelMarkers: LabelMarkers = {};
      map.on("draw:created", function (e) {
        var layer = (e as L.DrawEvents.Created).layer;
        // TODO use custom modal
        var category = prompt("Category");
        var spaceName = prompt("Name");

        if (category && spaceName) {
          // layer.bindTooltip(spaceName, {
          //   permanent: true,
          //   direction: "center",
          // });
          editableLayers.addLayer(layer);

          var poi = (layer as L.Polygon).getBounds().getCenter();
          var labelMarker = L.marker(poi, {
            draggable: true,
            icon: labelIcon(spaceName),
          }).addTo(map);
          // @ts-ignore
          labelMarkers[layer._leaflet_id] = labelMarker;

          layer.feature = {
            type: "Feature",
            properties: {
              category: category,
              name: spaceName,
              poi: [poi.lat, poi.lng],
            },
            geometry: layer.toGeoJSON().geometry,
          };
          setGeoData(editableLayers.toGeoJSON());

          labelMarker.on("dragend", function () {
            if (
              !(layer as L.Polygon)
                .getBounds()
                .contains(labelMarker.getLatLng())
            ) {
              labelMarker.setLatLng(poi);
              return;
            }
            poi = labelMarker.getLatLng();
            layer.feature!.properties.poi = [poi.lat, poi.lng];
            setGeoData(editableLayers.toGeoJSON());
          });

          labelMarker.on("dblclick", function () {
            // TODO use custom modal
            spaceName = prompt("New name");
            if (spaceName) {
              labelMarker.setIcon(labelIcon(spaceName));
              layer.feature!.properties.name = spaceName;
              setGeoData(editableLayers.toGeoJSON());
            }
          });
        }
        /*
        layer.on("dblclick", function () {
          map.doubleClickZoom.disable();
          spaceName = prompt("Enter new room name:");
          if (spaceName) {
            layer.setTooltipContent(spaceName);
            if (layer.feature?.properties && layer.feature.properties.name) {
              layer.feature.properties.name = spaceName;
            }
            setGeoData(editableLayers.toGeoJSON());
          }
        });
        */
      });

      map.on("draw:deleted", function (e) {
        // @ts-ignore
        var deletedLayers = e.layers;
        deletedLayers.eachLayer(function (layer: any) {
          map.removeLayer(labelMarkers[layer._leaflet_id]);
          delete labelMarkers[layer._leaflet_id];
        });
        setGeoData(editableLayers.toGeoJSON());
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
          message: "Error loading image:" + error,
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

  return (
    <CustomLayout>
      <div className="w-full flex">
        <div
          id="map"
          style={{
            position: "sticky",
            height: "90vh",
            width: "75%",
            background: "#F5F5F5",
          }}
          ref={mapDivRef}
        />
        <div className="w-1/4 max-h-[90vh] p-5 flex flex-col gap-5 overflow-auto">
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
          <Form layout="vertical" form={form}>
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
                  setFloorPlanData(
                    Object.assign(
                      {},
                      {
                        floor: {
                          level: form.getFieldValue("floorLevel"),
                          name: form.getFieldValue("floorName"),
                        },
                      },
                      geoData,
                    ),
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
          {/* END DEV ONLY */}
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
        open={spacePropModalOpen}
        onOk={() => setSpacePropModalOpen(false)}
        onCancel={() => setSpacePropModalOpen(false)}
      >
        <Form layout="vertical" className="mt-5">
          <Form.Item label="Type" required>
            <Radio.Group defaultValue={"room"}>
              <Radio value="room">Room</Radio>
              <Radio value="corridor">Corridor</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Name" required>
            <Input placeholder="AX.0Y" />
          </Form.Item>
        </Form>
      </Modal>
    </CustomLayout>
  );
};

export default DrawFloorPlan;

interface LabelMarkers {
  [key: string]: L.Marker;
}
