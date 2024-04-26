"use client";

import React, { useEffect, useState } from "react";
import CustomLayout from "@/components/layout/CustomLayout";
import { Alert, Button, Table, TableColumnsType, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PAGE_ROUTES } from "@/config/constants";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { deleteFloorPlan, getAllFloorPlan } from "@/services/floorPlan";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

interface FloorDataType {
  key: number;
  level: number;
  name: string;
}

const FloorPlanListPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [floorData, setFloorData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [floorToDelete, setFloorToDelete] = useState<FloorDataType | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const columns: TableColumnsType<FloorDataType> = [
    {
      title: "Floor Level",
      dataIndex: "level",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.level - b.level,
      width: "20%",
    },
    {
      title: "Floor Name",
      dataIndex: "name",
      render: (_, record) => (
        <a href={`${PAGE_ROUTES.floorPlanDetail}?floorId=${record.key}`}>
          Lantai {record.name}
        </a>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          className="p-0"
          onClick={() => {
            setFloorToDelete(record);
            setDeleteModalOpen(true);
          }}
        >
          Delete
        </Button>
      ),
      width: "20%",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFloorPlan();
      const formattedData = response?.data?.map((item: any) => {
        const { id, ...rest } = item;
        return { key: id, ...rest };
      });
      setFloorData(formattedData);
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

  const handleCancel = () => {
    setFloorToDelete(null);
    setDeleteModalOpen(false);
  };

  const deleteFloor = async (floorId: any) => {
    setIsDeleting(true);
    try {
      const response = await deleteFloorPlan(floorId);
      if (response.status === 200) {
        setFloorToDelete(null);
        setIsDeleting(false);
        setDeleteModalOpen(false);
        notification.open({
          type: "success",
          duration: 8,
          message: "Deletion successful",
          description: `Lantai ${floorToDelete?.name} has been deleted. All access points on this floor have also been removed.`,
        });
        fetchData();
      }
    } catch (error: any) {
      setIsDeleting(false);
      if (error.response?.data?.error?.message) {
        notification.open({
          type: "error",
          message: "Error deleting floor plan",
          description: error.response.data.error.message,
        });
      } else {
        console.error(error);
        notification.open({
          type: "error",
          message: "Error deleting floor plan",
          description: "An unexpected error occurred.",
        });
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
          <h2 className="m-0">Floor Plan List</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            href={PAGE_ROUTES.createFloorPlan}
          >
            New Floor Plan
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={floorData}
          bordered
          pagination={false}
        />
      </div>

      <ConfirmationModal
        title={`Delete Floor Plan: Lantai ${floorToDelete?.name}`}
        open={deleteModalOpen}
        onCancel={handleCancel}
        okText="Delete"
        onOk={() => deleteFloor(floorToDelete?.key)}
        isSubmitting={isDeleting}
      >
        <div className="w-full flex flex-col gap-5 my-5">
          <span>Are you sure you want to delete this floor plan?</span>
          <Alert
            type="warning"
            showIcon
            message="Warning"
            description="Deleting this item will also remove all access points on this floor. This action cannot be undone."
          />
        </div>
      </ConfirmationModal>
    </CustomLayout>
  );
};

export default FloorPlanListPage;
