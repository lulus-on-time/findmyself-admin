"use-client";

import { notification } from "antd";

// temp
export function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notification.open({
          message: "Text copied to clipboard",
        });
        resolve();
      })
      .catch((err) => {
        notification.open({
          message: "Failed to copy text to clipboard:" + err,
        });
        reject(err);
      });
  });
}
