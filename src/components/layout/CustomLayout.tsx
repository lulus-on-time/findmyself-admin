"use client";

import React from "react";
import theme from "@/theme/themeConfig";
import { ConfigProvider, Layout, Menu } from "antd";
import { PAGE_ROUTES } from "@/config/constants";
import { usePathname } from "next/navigation";

interface Props {
  children?: any;
}

const { Header, Content } = Layout;

const menu = [
  {
    label: "Floor Plan",
    url: `${PAGE_ROUTES.floorPlanList}`,
  },
  {
    label: "Access Point",
    url: `${PAGE_ROUTES.accessPointList}`,
  },
];

const menuItems = menu.map((item, index) => {
  const { label, url } = item;
  return {
    key: url,
    label: (
      <a key={index} href={url}>
        {label}
      </a>
    ),
    url: url,
  };
});

const CustomLayout = ({ children, ...props }: Props) => {
  const pathname = usePathname();

  return (
    <ConfigProvider theme={theme}>
      <Layout className="min-h-screen">
        <Header className="sticky top-0 z-10 w-full flex items-center gap-5 h-[12vh]">
          <div className="text-white font-semibold">
            FindMyself <i className="text-yellow-500 font-medium">Admin</i>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[`/${pathname.split("/")[1]}`]}
            items={menuItems}
            style={{ flex: 1, minWidth: 0, maxHeight: "100%" }}
          />
        </Header>
        <Content>{children}</Content>
      </Layout>
    </ConfigProvider>
  );
};

export default CustomLayout;
