"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw-src.css";
import CustomLayout from "@/components/layout/CustomLayout";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, notification } from "antd";
import { accessPointIcon, spaceLabelIcon } from "@/components/icons/marker";
import { getFloorPlanDetail } from "@/services/floorPlan";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_ROUTES } from "@/config/constants";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import ApTutorialModal from "@/components/modals/ApTutorialModal";
import ApDetailModal from "@/components/modals/ApDetailModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import {
  getAccessPointGeoJSON,
  postEditAccessPoint,
} from "@/services/accessPoint";

const EditAccessPointPage = () => {
  const floorId = useSearchParams().get("floorId");
  const router = useRouter();
  // useRef
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapLRef = useRef<L.Map | null>(null);
  const editableLayers = useRef<L.FeatureGroup | null>(null);
  const globalAp = useRef<L.Marker | null>(null);
  // Modal
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [createApModalOpen, setCreateApModalOpen] = useState(false);
  const [editApModalOpen, setEditApModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  // Form
  const [createApForm] = Form.useForm();
  const [editApForm] = Form.useForm();
  // Service
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Data
  var floorPlanData: any = null;
  var fetchedApData: any = null;
  const [floorName, setFloorName] = useState<string>("");
  const [spaceDict] = useState<any>({});
  const [apData, setApData] = useState<any>([]);

  useEffect(() => {
    fetchFPandAP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFPandAP = async () => {
    setIsFetching(true);

    try {
      const fpResponse = await getFloorPlanDetail(floorId);
      floorPlanData = fpResponse.data;
    } catch (error: any) {
      setErrorStatus(true);
      if (error.response?.data?.error?.message) {
        setErrorMessage(error.response.data.error.message);
      } else {
        setErrorMessage(error.toString());
      }
      setIsFetching(false);
      return;
    }

    try {
      const apResponse = await getAccessPointGeoJSON(floorId);
      fetchedApData = apResponse.data;
      setFloorName(apResponse.data.floor.name);
    } catch (error: any) {
      setErrorStatus(true);
      if (error.response?.data?.error?.message) {
        setErrorMessage(error.response.data.error.message);
      } else {
        setErrorMessage(error.toString());
      }
      setIsFetching(false);
      return;
    }

    initMap();
    setIsFetching(false);
  };

  const initMap = () => {
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

        const spaceLabel = L.marker(feature.properties.poi, {
          icon: spaceLabelIcon(feature.properties.name),
        }).addTo(map);

        spaceDict[feature.properties.id] = feature.properties.name;

        function addAP(e: any) {
          const apMarker = L.marker(e.latlng, {
            icon: accessPointIcon,
          });

          apMarker.feature = {
            type: "Feature",
            properties: {
              spaceId: feature.properties.id,
              bssids: [],
              description: "",
            },
            geometry: apMarker.toGeoJSON().geometry,
          };

          editableLayers.current!.addLayer(apMarker);
          globalAp.current = apMarker;

          createApForm.setFieldValue(
            "location",
            spaceDict[feature.properties.id],
          );
          setCreateApModalOpen(true);
        }

        layer.on("click", function (e: any) {
          map.doubleClickZoom.disable();
          addAP(e);
        });

        spaceLabel.on("click", function (e: any) {
          map.doubleClickZoom.disable();
          addAP(e);
        });
      }

      L.geoJSON(floorPlanData.geojson, {
        onEachFeature: onEachFeature,
      }).addTo(map);

      L.geoJSON(fetchedApData.geojson, {
        pointToLayer(_, latlng) {
          const apMarker = L.marker(latlng, {
            icon: accessPointIcon,
          });
          editableLayers.current?.addLayer(apMarker);

          apMarker.on("click", function () {
            mapLRef.current!.doubleClickZoom.disable();
            globalAp.current = apMarker;
            editApForm.setFieldsValue({
              location: `${spaceDict[apMarker.feature!.properties.spaceId]}`,
              description: apMarker.feature!.properties.description,
              bssids: apMarker.feature!.properties.bssids,
            });
            setEditApModalOpen(true);
          });

          return apMarker;
        },
        onEachFeature(feature, layer) {
          // @ts-ignore
          layer.feature = {
            type: "Feature",
            properties: {
              // TODO add AP id
              spaceId: feature.properties.spaceId,
              bssids: feature.properties.bssids,
              description: feature.properties.description,
            },
            geometry: feature.geometry,
          };
        },
      });
      setApData(Object(editableLayers.current!.toGeoJSON()).features);

      mapLRef.current = map;
    }
  };

  const createAp = (values: any) => {
    var apMarker = globalAp.current;
    apMarker!.feature!.properties.description = values.description;
    apMarker!.feature!.properties.bssids = values.bssids;
    setApData(Object(editableLayers.current!.toGeoJSON()).features);

    apMarker!.on("click", function () {
      mapLRef.current!.doubleClickZoom.disable();
      globalAp.current = apMarker;
      editApForm.setFieldsValue({
        location: `${spaceDict[apMarker!.feature!.properties.spaceId]}`,
        description: apMarker!.feature!.properties.description,
        bssids: apMarker!.feature!.properties.bssids,
      });
      setEditApModalOpen(true);
    });

    setCreateApModalOpen(false);
    createApForm.resetFields();
  };

  const editAp = (values: any) => {
    var apMarker = globalAp.current;
    apMarker!.feature!.properties.description = values.description;
    apMarker!.feature!.properties.bssids = values.bssids;
    setApData(Object(editableLayers.current!.toGeoJSON()).features);

    setEditApModalOpen(false);
    editApForm.resetFields();
  };

  const deleteAp = () => {
    editableLayers.current?.removeLayer(globalAp.current!);
    setEditApModalOpen(false);
    setApData(Object(editableLayers.current!.toGeoJSON()).features);
  };

  const cancelCreateAp = () => {
    editableLayers.current!.removeLayer(globalAp.current!);
    setCreateApModalOpen(false);
    createApForm.resetFields();
  };

  const cancelEditAp = () => {
    setEditApModalOpen(false);
    editApForm.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed: ", errorInfo);
  };

  const submitData = async (dataToSend: any) => {
    setIsSubmitting(true);

    try {
      const response = await postEditAccessPoint(floorId, dataToSend);
      if (response.status === 200) {
        router.push(`${PAGE_ROUTES.accessPointDetail}?floorId=${floorId}`);
        notification.open({
          type: "success",
          message: "Update successful",
          description: `Access point on Lantai ${floorName} has been updated.`,
        });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.data?.errors?.message) {
        notification.open({
          type: "error",
          message: "Error submitting form",
          description: error.response.data.errors.message,
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

  if (isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <CustomLayout>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-3/4">
          {errorStatus && (
            <Alert
              message="Error fetching floor plan"
              description={errorMessage}
              type="error"
              showIcon
              className="rounded-none"
            />
          )}
          {!errorStatus && (
            <Alert
              message="Click anywhere within the floor plan (blue area) to add an access point"
              type="info"
              closable
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
        </div>
        <div className="w-full md:w-1/4 max-h-[90vh] p-5 flex flex-col gap-5 overflow-auto">
          <div className="flex flex-col">
            <div className="flex justify-between items-center gap-5">
              <div className="flex items-center gap-3">
                <h3>Access Point Map - Lantai {floorName}</h3>
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

            <Alert
              type="warning"
              message={`Changes won't be saved until the save button is clicked.`}
            />
          </div>

          {apData &&
            apData.map((item: any, index: any) => (
              <Card
                key={index}
                size="small"
                title={`${spaceDict[item.properties.spaceId]}${
                  item.properties.description
                    ? ` - ${item.properties.description}`
                    : ""
                }`}
              >
                <div className="flex flex-col gap-2">
                  {item.properties.bssids.map((bssidItem: any, id: any) => (
                    <div key={id} className="flex flex-col">
                      <span>
                        <b>SSID:</b> {bssidItem.ssid}
                      </span>
                      <span>
                        <b>BSSID:</b> {bssidItem.bssid}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

          <Button
            type="primary"
            className="w-fit"
            onClick={() => {
              setSaveModalOpen(true);
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <ApTutorialModal
        open={tutorialModalOpen}
        onOk={() => setTutorialModalOpen(false)}
        onCancel={() => setTutorialModalOpen(false)}
      />

      <ApDetailModal
        title="Create Access Point"
        open={createApModalOpen}
        form={createApForm}
        onCancel={cancelCreateAp}
        onFinish={createAp}
        onFinishFailed={onFinishFailed}
        initialValues={{ bssids: [""] }}
      />

      <ApDetailModal
        title="Edit Access Point"
        open={editApModalOpen}
        form={editApForm}
        onCancel={cancelEditAp}
        onFinish={editAp}
        onFinishFailed={onFinishFailed}
        onDelete={deleteAp}
      />

      <ConfirmationModal
        title="Save Changes"
        open={saveModalOpen}
        onCancel={() => setSaveModalOpen(false)}
        okText="Save"
        onOk={() => submitData(editableLayers.current?.toGeoJSON())}
        isSubmitting={isSubmitting}
      >
        Are you sure you want to save these changes?
      </ConfirmationModal>
    </CustomLayout>
  );
};

export default EditAccessPointPage;
