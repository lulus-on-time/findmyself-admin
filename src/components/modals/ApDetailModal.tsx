"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
} from "antd";
import {
  ImportOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface Network {
  key: React.Key;
  ssid: string;
  bssid: string;
}

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
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<any>([]);

  const columns: TableColumnsType<Network> = [
    {
      title: "SSID",
      dataIndex: "ssid",
    },
    {
      title: "BSSID",
      dataIndex: "bssid",
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: Network[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedNetwork(selectedRows);
    },
    getCheckboxProps: (record: Network) => ({
      name: record.bssid,
    }),
  };

  const importNetwork = () => {
    var currentNetwork = form.getFieldValue("bssids");
    currentNetwork = currentNetwork[0] ? currentNetwork : [];
    var newNetwork = selectedNetwork.map((item: Network) => {
      return {
        ssid: item.ssid,
        bssid: item.bssid,
      };
    });
    var bssids = currentNetwork.concat(newNetwork);
    form.setFieldValue("bssids", bssids);
    setImportModalOpen(false);
    setSelectedRowKeys([]);
    setSelectedNetwork([]);
  };

  const cancelImport = () => {
    setImportModalOpen(false);
    setSelectedRowKeys([]);
  };

  return (
    <div>
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
                    label={
                      index === 0 ? (
                        <div className="flex items-center">
                          <span>SSID & BSSID</span>
                          <Button
                            type="link"
                            icon={<ImportOutlined />}
                            onClick={() => setImportModalOpen(true)}
                          >
                            Import
                          </Button>
                        </div>
                      ) : (
                        ""
                      )
                    }
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
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
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

      <Modal
        title="Imported SSID & BSSID"
        open={importModalOpen}
        width={"90%"}
        onCancel={cancelImport}
        footer={[
          <Button key="import" type="primary" danger>
            Import New CSV
          </Button>,
          <Button key="cancel" onClick={cancelImport}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={importNetwork}
            disabled={!selectedRowKeys.length}
          >
            Ok
          </Button>,
        ]}
      >
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          className="mt-5"
        />
      </Modal>
    </div>
  );
};

export default ApDetailModal;

const data: Network[] = [
  {
    key: 1,
    ssid: "SSID 1",
    bssid: "BSSID 1",
  },
  {
    key: 2,
    ssid: "SSID 2",
    bssid: "BSSID 2",
  },
  {
    key: 3,
    ssid: "SSID 3",
    bssid: "BSSID 3",
  },
  {
    key: 4,
    ssid: "SSID 4",
    bssid: "BSSID 4",
  },
  {
    key: 5,
    ssid: "SSID 5",
    bssid: "BSSID 5",
  },
  {
    key: 6,
    ssid: "SSID 6",
    bssid: "BSSID 6",
  },
  {
    key: 7,
    ssid: "SSID 7",
    bssid: "BSSID 7",
  },
  {
    key: 8,
    ssid: "SSID 8",
    bssid: "BSSID 8",
  },
  {
    key: 9,
    ssid: "SSID 9",
    bssid: "BSSID 9",
  },
  {
    key: 10,
    ssid: "SSID 10",
    bssid: "BSSID 10",
  },
  {
    key: 11,
    ssid: "SSID 11",
    bssid: "BSSID 11",
  },
];
