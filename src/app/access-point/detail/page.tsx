"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CustomLayout from "@/components/layout/CustomLayout";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { PAGE_ROUTES } from "@/config/constants";
import { AppstoreOutlined } from "@ant-design/icons";
import { Alert, Button, Table, TableColumnsType } from "antd";
import { dummyData } from "./dummy";
import { ApDetailDataType } from "../type";

const AccessPointDetailPage = () => {
  const searchParams = useSearchParams();
  const floorId = searchParams.get("floorId");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apDetailData, setApDetailData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setApDetailData(dummyData);
  }, []);

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
    },
    {
      title: "SSID",
      dataIndex: "ssid",
    },
    {
      title: "BSSID",
      dataIndex: "bssid",
    },
    {
      title: "Total BSSID",
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
    },
  ];

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
            closable
            onClose={() => {
              setErrorStatus(false);
              setErrorMessage("");
            }}
          />
        )}
        <div className="flex flex-col md:flex-row gap-5 justify-between md:items-center">
          <h2 className="m-0">Access Point Detail - Lantai {floorId}</h2>
          <Button type="primary" icon={<AppstoreOutlined />} href={""}>
            See Floor Plan
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
