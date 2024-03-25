"use client";

import React from "react";
import theme from "@/theme/themeConfig";
import { ConfigProvider, Layout, Menu } from "antd";

interface Props {
  children?: any;
}

const { Header, Content } = Layout;

const items = new Array(3).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const CustomLayout = ({ children, ...props }: Props) => {
  return (
    <ConfigProvider theme={theme}>
      <Layout className="min-h-screen">
        <Header className="sticky top-0 z-10 w-full flex items-center gap-5 min-h-[10vh]">
          <div className="text-white font-semibold">
            FindMyself <i className="text-yellow-500 font-medium">Admin</i>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content>{children}</Content>
      </Layout>
    </ConfigProvider>
  );
};

export default CustomLayout;
