"use client";

import React from "react";
import { Modal } from "antd";

const ApTutorialModal = ({ open, onOk, onCancel, ...props }: any) => {
  return (
    <Modal title="Tutorial" open={open} onOk={onOk} onCancel={onCancel}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

export default ApTutorialModal;
