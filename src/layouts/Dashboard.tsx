import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { getMenuItems } from "../utils/commonFunction";
import Sider from "antd/es/layout/Sider";
import Logo from "../components/icons/Logo";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { BellFilled } from "@ant-design/icons";
import { logoutUser } from "../services/auth.service";
import { toast } from "react-toastify";
import { useLogoutUser } from "../hooks/useLogoutUser";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  // call getself
  const { user } = useAuthStore();
  const { logout: logoutFromStore } = useAuthStore();
  const location = useLocation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const callbackLogOutSuccess = async () => {
    logoutFromStore();
    return;
  };

  const callbackLogOutError = async (message: string) => {
    toast.error(message);
  };

  const { mutate: logoutUserMuate } = useLogoutUser(
    callbackLogOutSuccess,
    callbackLogOutError
  );

  if (user === null) {
    return (
      <Navigate
        // to={`/auth/login`}
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  console.log(user);

  const items = getMenuItems(user.role);

  return (
    <div>
      <Layout style={{ minHeight: "100vh", background: colorBgContainer }}>
        <Sider
          collapsible
          theme="light"
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>

          <Menu
            theme="light"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={
                  user.role === "admin" ? "You are an admin" : user.tenant?.name
                }
                status="success"
              />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutUserMuate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f56a00",
                    }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "24px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Mernspace pizza shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
