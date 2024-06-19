"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { PAGE_ROUTES } from "@/config/constants";
import { Alert, Button, Table, TableColumnsType } from "antd";
import { getAccessPointDetail } from "@/services/accessPoint";
import CustomLayout from "@/components/layout/CustomLayout";
import { ApDetailDataType } from "../type";

const AccessPointDetailPage = () => {
  const searchParams = useSearchParams();
  const floorId = searchParams.get("floorId");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [floorName, setFloorName] = useState<string>("");
  const [apDetailData, setApDetailData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const columns: TableColumnsType<ApDetailDataType> = [
    {
      title: "No",
      dataIndex: "number",
      render: (_, __, index) => index + 1,
      width: "10%",
    },
    {
      title: "AP Location",
      dataIndex: "locationName",
      render: (_, record) => record.apInfo.locationName,
      onCell: (record, index) => ({
        rowSpan:
          index &&
          index !== 0 &&
          record.apInfo.id === apDetailData[index - 1].apInfo.id
            ? 0
            : record.apInfo.bssidTotal,
      }),
      width: "15%",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_, record) =>
        record.apInfo.description ? record.apInfo.description : "-",
      onCell: (record, index) => ({
        rowSpan:
          index &&
          index !== 0 &&
          record.apInfo.id === apDetailData[index - 1].apInfo.id
            ? 0
            : record.apInfo.bssidTotal,
      }),
      width: "25%",
    },
    {
      title: "Total of Networks",
      dataIndex: "bssidTotal",
      render: (_, record) => record.apInfo.bssidTotal,
      onCell: (record, index) => ({
        rowSpan:
          index &&
          index !== 0 &&
          record.apInfo.id === apDetailData[index - 1].apInfo.id
            ? 0
            : record.apInfo.bssidTotal,
      }),
      width: "10%",
    },
    {
      title: "SSID",
      dataIndex: "ssid",
      width: "15%",
    },
    {
      title: "BSSID",
      dataIndex: "bssid",
      width: "25%",
    },
  ];

  useEffect(() => {
    fetchData(floorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (floorId: any) => {
    setIsLoading(true);
    try {
      const response = await getAccessPointDetail(floorId);
      setFloorName(response.data.floorName);
      setApDetailData(response.data.bssids);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setErrorStatus(true);
      if (error.response?.data?.error?.message) {
        setErrorMessage(error.response.data.error.message);
      } else {
        setErrorMessage(error.toString());
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <CustomLayout>
      <div className="p-10 flex flex-col gap-10">
        {errorStatus && (
          <Alert
            type="error"
            showIcon
            message="Error fetching data"
            description={errorMessage}
          />
        )}
        <div className="flex flex-col md:flex-row gap-5 justify-between md:items-center">
          <h2 className="m-0">Access Point Detail - Lantai {floorName}</h2>
          <Button
            type="primary"
            href={`${PAGE_ROUTES.editAccessPoint}?floorId=${floorId}`}
          >
            View/Edit AP on Floor Plan
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={apDetailData}
          bordered
          pagination={false}
        />
      </div>
    </CustomLayout>
  );
};

export default AccessPointDetailPage;
