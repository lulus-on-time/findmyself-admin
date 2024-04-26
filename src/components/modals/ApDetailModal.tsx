"use client";

import React from "react";
import { Button, Form, Input, Modal, Popconfirm } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ApDetailModal = ({
  title,
  open,
  onCancel,
  form,
  onFinish,
  onFinishFailed,
  onDelete,
  initialValues,
}: any) => {
  return (
    <Modal title={title} open={open} onCancel={onCancel} footer={[]}>
      <Form
        layout="vertical"
        className="mt-5"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={initialValues}
      >
        <Form.Item label="Location" name="location" required>
          <Input disabled />
        </Form.Item>
        <Form.Item label="AP Description (optional)" name="description">
          <Input placeholder="Sebelah kanan pintu" />
        </Form.Item>
        <Form.List name="bssids">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  required
                  key={field.key}
                  label={index === 0 ? "SSID & BSSID" : ""}
                >
                  <div className="w-full flex gap-2 items-center">
                    <Form.Item
                      noStyle
                      name={[field.name, "ssid"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter SSID or remove this field",
                        },
                      ]}
                    >
                      <Input placeholder="Enter SSID" />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      name={[field.name, "bssid"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter BSSID or remove this field",
                        },
                      ]}
                    >
                      <Input placeholder="Enter BSSID" />
                    </Form.Item>

                    {fields.length > 1 ? (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    ) : null}
                  </div>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add field
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item className="w-full flex justify-end">
          <div className="flex gap-2">
            {onDelete && (
              <Popconfirm
                title="Delete Access Point"
                description={
                  <span className="pr-5">
                    Are you sure to delete this AP?
                    <br />
                    This action cannot be undone.
                  </span>
                }
                onConfirm={onDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>
                  Delete AP
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

export default ApDetailModal;
