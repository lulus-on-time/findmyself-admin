"use client";

import React from "react";
import { Button, Form, Input, Modal, Radio } from "antd";

const SpaceDetailModal = ({
  title,
  open,
  onCancel,
  form,
  initialValues,
  onFinish,
  onFinishFailed,
  categoryValue,
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
