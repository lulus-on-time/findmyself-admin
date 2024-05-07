"use client";

import React, { useState } from "react";
import {
  Alert,
  Button,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import {
  ImportOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Papa from "papaparse";

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
  const [thisVisible, setThisVisible] = useState<boolean>(true);
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<any>([]);
  const [importedData, setImportedData] = useState<Network[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const updateBssids = () => {
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
    setThisVisible(true);

    setSelectedRowKeys([]);
    setSelectedNetwork([]);
  };

  const cancelImport = () => {
    setImportModalOpen(false);
    setThisVisible(true);

    setSelectedRowKeys([]);
    setSelectedNetwork([]);
  };

  const props: UploadProps = {
    name: "file",
    accept: ".csv",
    multiple: false,
    maxCount: 1,
    customRequest(options) {
      const { file, onSuccess } = options;
      if (file && onSuccess) {
        setSelectedRowKeys([]);
        setSelectedNetwork([]);

        Papa.parse(file as string, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            var result = results.data.map((item: any, key: number) => {
              return {
                key: key + 1,
                ssid: item.SSID,
                bssid: item.BSSID,
              };
            });
            setImportedData(result);
            // save to local storage
          },
        });
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      }
    },
    showUploadList: false,
  };

  return (
    <div>
      <Modal
        title={title}
        open={open}
        onCancel={onCancel}
        footer={[]}
        className={thisVisible ? "block" : "hidden"}
      >
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
                            onClick={() => {
                              setThisVisible(false);
                              setImportModalOpen(true);
                            }}
                          >
                            <span className="underline">Import</span>
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
          <Tooltip
            key={"import"}
            title="Uploading a new CSV will replace the existing one"
          >
            <Upload {...props}>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimary: "#13C2C2",
                      colorPrimaryHover: "#11ABAB",
                      colorPrimaryActive: "#0F9191",
                    },
                  },
                }}
              >
                <Button
                  type="primary"
                  icon={<ImportOutlined />}
                  className="mr-2"
                >
                  Import New CSV
                </Button>
              </ConfigProvider>
            </Upload>
          </Tooltip>,
          <Button key={"cancel"} onClick={cancelImport}>
            Cancel
          </Button>,
          <Button
            key={"ok"}
            type="primary"
            onClick={updateBssids}
            disabled={!selectedRowKeys.length}
          >
            Ok
          </Button>,
        ]}
      >
        <Alert
          type="info"
          showIcon
          message={
            <div className="flex gap-2">
              <span>
                {`CSV file must include 'SSID' and 'BSSID' in the header.`}
              </span>
              <a
                target="_blank"
                href="/csv/ssid-bssid-example.csv"
                className="underline hover:underline focus:underline"
              >
                Download an example here
              </a>
            </div>
          }
        />
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={importedData}
          className="mt-5"
        />
      </Modal>
    </div>
  );
};

export default ApDetailModal;
