"use client";

import React, { useEffect, useState } from "react";
import CustomLayout from "@/components/layout/CustomLayout";
import { Alert, Button, Table, TableColumnsType } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PAGE_ROUTES } from "@/config/constants";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { getAllFloorData } from "@/services/floorPlan";

interface FloorDataType {
  key: number;
  level: number;
  name: string;
}

const columns: TableColumnsType<FloorDataType> = [
  {
    title: "Level",
    dataIndex: "level",
    defaultSortOrder: "ascend",
    sorter: (a, b) => a.level - b.level,
    width: "20%",
  },
  {
    title: "Floor Name",
    dataIndex: "name",
    render: (name: string) => <a>Lantai {name}</a>,
  },
  {
    title: "Action",
    render: (_, record) => (
      <Button type="link" danger className="p-0">
        Delete
      </Button>
    ),
    width: "20%",
  },
];

const FloorPlanListPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [floorData, setFloorData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFloorData();
      const formattedData = response?.data?.map((item: any) => {
        const { id, ...rest } = item;
        return { key: id, ...rest };
      });
      setFloorData(formattedData);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setErrorStatus(true);
      setErrorMessage(error.toString());
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
            closable
            onClose={() => {
              setErrorStatus(false);
              setErrorMessage("");
            }}
          />
        )}
        <div className="flex flex-col md:flex-row gap-5 justify-between md:items-center">
          <h2 className="m-0">Floor Plan List</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            href={PAGE_ROUTES.createFloorPlan}
          >
            New Floor Plan
          </Button>
        </div>
        <Table columns={columns} dataSource={floorData} />
      </div>
    </CustomLayout>
  );
};

export default FloorPlanListPage;
