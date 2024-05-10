"use client";

import React from "react";
import { Collapse, CollapseProps, Modal } from "antd";
import Image from "next/image";

const FpTutorialModal = ({ open, onCancel, ...props }: any) => {
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Getting Started: Adding Image Overlay",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Upload New Image Button"
              src={"/images/upload-img-overlay.png"}
              width={445}
              height={335}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>Begin by uploading an image of your floor plan</b>
            <br />
            {`This image will serve as a base for drawing purposes only and won't be saved. Once uploaded, the drawing toolbar will appear.`}
          </span>
          <ul>
            <li>
              Recommended image dimensions: 800 pixels in height with minimal
              whitespace.
            </li>
            <li>Supported file formats: PNG, JPG, JPEG, WebP, SVG.</li>
            <li>Note: Uploading a new image will replace the existing one.</li>
          </ul>
        </div>
      ),
    },
    {
      key: "2",
      label: "Adjust Image Overlay Opacity",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Image Opacity Slider"
              src={"/images/opacity-slider.png"}
              width={445}
              height={335}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>
              Use the opacity slider to adjust the transparency of the image
            </b>
            <br />
            You can set the opacity from 0% (for better visibility of drawn
            content) to 100% (for clearer view of the image)
          </span>
        </div>
      ),
    },
    {
      key: "3",
      label: "Creating Spaces (Rooms or Corridors)",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Drawing Toolbar"
              src={"/images/create-spaces.png"}
              width={422}
              height={286}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>Select the appropriate tool from the drawing toolbar</b>
            <br />
            Two shapes are available:
            <ul>
              <li>
                Polygon: Click on the map to set polygon vertices. Double-click
                or click the first vertex to finish.
              </li>
              <li>
                Rectangle: Click once to start, drag to size, then release to
                finish.
              </li>
            </ul>
            After drawing, fill out the necessary form.
          </span>
        </div>
      ),
    },
    {
      key: "4",
      label: "Changing Points of Interest (POI)",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Drag POI Marker"
              src={"/images/change-poi.png"}
              width={422}
              height={286}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>
              Drag the label marker to any desired location within the space
            </b>
            <br />
            {`Label marker represents the point of interest. Ensure the marker stays within the space boundary.`}
          </span>
        </div>
      ),
    },
    {
      key: "5",
      label: "Renaming, Changing Space Type, or Deleting Space",
      children: (
        <div className="flex flex-col">
          <div className="w-full flex justify-center bg-[#e5e5e5] mb-3">
            <Image
              alt="Double click on POI Marker"
              src={"/images/edit-space.png"}
              width={422}
              height={286}
              className="w-1/2 h-auto"
            />
          </div>
          <span>
            <b>Double-click on the label marker</b>
            <ul>
              <li>To rename or change space type, edit the form.</li>
              <li>To delete the space, click the delete button.</li>
            </ul>
            Please note that actions cannot be undone. Proceed with caution.
          </span>
        </div>
      ),
    },
  ];

  return (
    <Modal title="Tutorial" open={open} onCancel={onCancel} footer={[]}>
      <Collapse accordion items={items} defaultActiveKey={["1"]} />
    </Modal>
  );
};

export default FpTutorialModal;
