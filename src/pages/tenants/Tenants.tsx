import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { FetchTenants } from "../../services/tenants.service";
import { TenantTablecolumns } from "../../components/users/TenantTable";
import TenantFilter from "./TenantsFilter";

const Tenants = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const {
    data: fetchTenantData,
    isFetching: fetchTenantIsFetching,
    isError: fetchTenantIsError,
    error: fetchTenantError,
  } = FetchTenants();
  console.log(fetchTenantData);

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Tenants" },
            ]}
          />
          {fetchTenantIsFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {fetchTenantIsError && (
            <Typography.Text type="danger">
              {fetchTenantError.message}
            </Typography.Text>
          )}
        </Flex>
        <TenantFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Restaurant
          </Button>
        </TenantFilter>
        <Table
          columns={[...TenantTablecolumns]}
          dataSource={fetchTenantData?.data?.tenantGetAllDto}
          rowKey={"id"}
        />

        <Drawer
          title={"Create restaurant"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          //   destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            // setCurrentEditingUser(null);
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            {/* <UserForm isEditMode={!!currentEditingUser} /> */}
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
