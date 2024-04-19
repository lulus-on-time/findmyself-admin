"use client";

import React from "react";
import { Button, Modal } from "antd";

const ConfirmationModal = ({
  title,
  open,
  onCancel,
  okText,
  onOk,
  children,
  isSubmitting,
}: any) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key={"cancel"} onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button
          key={"ok"}
          type="primary"
          danger={okText === "Delete" ? true : false}
          onClick={onOk}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {okText}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default ConfirmationModal;
