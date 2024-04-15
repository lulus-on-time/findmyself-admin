"use client";

import React, { useEffect, useState } from "react";
import CustomLayout from "@/components/layout/CustomLayout";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { PAGE_ROUTES } from "@/config/constants";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Table, TableColumnsType } from "antd";
import { AccessPointDataType } from "./type";
import { dummyData } from "./dummy";

const AccessPointListPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessPointData, setAccessPointData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const columns: TableColumnsType<AccessPointDataType> = [
    {
      title: "No",
      dataIndex: "number",
      render: (_, __, index) => index + 1,
      width: "10%",
    },
    {
      title: "Floor",
      dataIndex: "floorName",
      render: (_, record) => (
        <a href={`${PAGE_ROUTES.accessPointDetail}?floorId=${record.floor.id}`}>
          Lantai {record.floor.name}
        </a>
      ),
      onCell: (record, index) => ({
        rowSpan:
          index &&
          index !== 0 &&
          record.floor.id === accessPointData[index - 1].floor.id
            ? 0
            : record.floor.apTotal,
      }),
    },
    {
      title: "AP Location",
      dataIndex: "locationName",
    },
    {
      title: "Total",
      dataIndex: "apTotal",
      render: (_, record) => record.floor.apTotal,
      onCell: (record, index) => ({
        rowSpan:
          index &&
          index !== 0 &&
          record.floor.id === accessPointData[index - 1].floor.id
            ? 0
            : record.floor.apTotal,
      }),
    },
  ];

  useEffect(() => {
    setAccessPointData(dummyData);
  }, []);

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
          <h2 className="m-0">Access Point List</h2>
          <Button type="primary" icon={<PlusOutlined />} href={""}>
            New Access Point
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={accessPointData}
          bordered
          pagination={false}
        />
      </div>
    </CustomLayout>
  );
};

export default AccessPointListPage;
