"use client";

import React from "react";
import { Collapse, CollapseProps, Modal } from "antd";
import Image from "next/image";

const ApTutorialModal = ({ open, onOk, onCancel, ...props }: any) => {
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Creating Access Point",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Marker Button"
              src={"/images/create-ap.png"}
              width={445}
              height={335}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>
              Click the marker button on the drawing toolbar, then click on the
              map to place the access point
            </b>
            <br />
            The access point must be located inside a space (room or corridor).
            <br />
            <p>
              <b> After that, fill out the necessary form</b>
              <br />
              You can add multiple SSID and BSSID for an access point.
            </p>
          </span>
        </div>
      ),
    },
    {
      key: "2",
      label: "Importing SSID and BSSID",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Import SSID and BSSID Button"
              src={"/images/import-network.png"}
              width={445}
              height={335}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>
              {`In the modal, click the "Import" button next to the SSID and BSSID
              field labels`}
            </b>
            <br />
            You can import a CSV file containing a list of SSID and BSSID pairs.
            To upload a new file:
            <ul>
              <li>{`Click "Import New CSV" button in the footer.`}</li>
              <li>
                {`The CSV file must contain "SSID" and "BSSID" in the header.`}
              </li>
              <li>Uploading a new CSV will replace the existing one.</li>
            </ul>
          </span>
        </div>
      ),
    },
    {
      key: "3",
      label: "Moving Access Point",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Drag AP marker"
              src={"/images/move-ap.png"}
              width={422}
              height={286}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>
              Drag the access point marker to any desired location within the
              floor plan
            </b>
          </span>
        </div>
      ),
    },
    {
      key: "4",
      label: "Editing Access Point Properties or Deleting Access Point",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Double click on AP Marker"
              src={"/images/edit-delete-ap.png"}
              width={422}
              height={286}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>Double-click on the access point marker</b>
            <ul>
              <li>
                To edit AP description, SSID, or BSSID, simply edit the form.
              </li>
              <li>{`To delete the access point, click the "Delete AP" button.`}</li>
            </ul>
            Please note that actions cannot be undone. Proceed with caution.
          </span>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Tutorial"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={[]}
    >
      <Collapse accordion items={items} defaultActiveKey={["1"]} />
    </Modal>
  );
};

export default ApTutorialModal;
