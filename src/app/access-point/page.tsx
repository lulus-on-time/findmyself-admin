"use client";

import React, { useEffect, useState } from "react";
import CustomLayout from "@/components/layout/CustomLayout";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { PAGE_ROUTES } from "@/config/constants";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Modal, Select, Table, TableColumnsType } from "antd";
import { AccessPointDataType } from "./type";
import { getAllFloorPlan } from "@/services/floorPlan";
import { useRouter } from "next/navigation";
import { getAllAccessPoint } from "@/services/accessPoint";

const AccessPointListPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessPointData, setAccessPointData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [floorModalOpen, setFloorModalOpen] = useState<boolean>(false);
  const [optionLoading, setOptionLoading] = useState<boolean>(false);
  const [optionErrorMsg, setOptionErrorMsg] = useState<string>("");
  const [floorOptions, setFloorOptions] = useState<any>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);

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
      render: (_, record) => <span>Lantai {record.floor.name}</span>,
      onCell: (record, index) => ({
        rowSpan:
          index &&
          index !== 0 &&
          record.floor.id === accessPointData[index - 1].floor.id
            ? 0
            : record.floor.apTotal,
      }),
      width: "20%",
    },
    {
      title: "AP Location",
      dataIndex: "locationName",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_, record) => record.description,
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
      width: "10%",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <a href={`${PAGE_ROUTES.accessPointDetail}?floorId=${record.floor.id}`}>
          Lihat BSSID
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
      width: "10%",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAccessPoint();
      setAccessPointData(response.data);
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

  const fetchFloorOptions = async () => {
    setOptionLoading(true);
    try {
      const response = await getAllFloorPlan();
      const options = response?.data?.map((item: any) => {
        return {
          value: item.id,
          label: `Lantai ${item.name}`,
          level: item.level,
        };
      });
      setFloorOptions(options);
      setOptionLoading(false);
    } catch (error: any) {
      setOptionErrorMsg("Error fetching floor list");
      setFloorOptions(null);
      setOptionLoading(false);
    }
  };

  const handleNewAPClick = () => {
    if (!floorOptions) {
      fetchFloorOptions();
    }
    setFloorModalOpen(true);
  };

  const cancelChooseFloor = () => {
    setOptionErrorMsg("");
    setSelectedFloorId(null);
    setFloorModalOpen(false);
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
          <h2 className="m-0">Access Point List</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewAPClick}
          >
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

      <Modal
        title="Choose Floor"
        open={floorModalOpen}
        onCancel={cancelChooseFloor}
        footer={[
          <Button key={"cancel"} onClick={cancelChooseFloor}>
            Cancel
          </Button>,
          <Button
            key={"ok"}
            type="primary"
            href={`${PAGE_ROUTES.editAccessPoint}?floorId=${selectedFloorId}`}
            disabled={selectedFloorId ? false : true}
          >
            Ok
          </Button>,
        ]}
      >
        {optionErrorMsg && (
          <Alert
            message={optionErrorMsg}
            type="error"
            showIcon
            className="mt-5"
          />
        )}
        <Select
          value={selectedFloorId}
          placeholder="Select a floor"
          options={floorOptions}
          loading={optionLoading}
          className="w-full my-5"
          filterSort={(a, b) => a.level - b.level}
          onChange={(value) => setSelectedFloorId(value)}
        />
      </Modal>
    </CustomLayout>
  );
};

export default AccessPointListPage;
