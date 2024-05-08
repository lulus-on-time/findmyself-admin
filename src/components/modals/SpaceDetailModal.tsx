"use client";

import React from "react";
import { Button, Form, Input, Modal, Popconfirm, Radio } from "antd";

const SpaceDetailModal = ({
  title,
  open,
  onCancel,
  form,
  initialValues,
  onFinish,
  onFinishFailed,
  categoryValue,
  onDelete,
  edit,
}: any) => {
  return (
    <Modal title={title} open={open} onCancel={onCancel} footer={[]}>
      <Form
        layout="vertical"
        className="mt-5"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Type" name="category" rules={[{ required: true }]}>
          <Radio.Group value={categoryValue}>
            <Radio value="room">Room</Radio>
            <Radio value="corridor">Corridor</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Name" name="spaceName" rules={[{ required: true }]}>
          <Input placeholder="AX.0Y" />
        </Form.Item>
        <Form.Item className="w-full flex justify-end">
          <div className="flex gap-2">
            {onDelete && (
              <Popconfirm
                title={edit ? "Warning" : "Delete Space"}
                description={
                  <span className="pr-20">
                    {edit && (
                      <b className="text-red-500">
                        Deleting a room will also remove all <br />
                        access points within that room.
                        <br />
                      </b>
                    )}
                    Are you sure to delete this space? <br />
                    This action cannot be undone.
                  </span>
                }
                onConfirm={onDelete}
                okText="Yes"
                okButtonProps={{ danger: true }}
                cancelText="No"
              >
                <Button type="primary" danger>
                  Delete Space
                </Button>
              </Popconfirm>
            )}
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Ok
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SpaceDetailModal;
