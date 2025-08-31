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
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FetchTenantsWithPagination } from "../../services/tenants.service";
import { TenantTablecolumns } from "../../components/users/TenantTable";
import TenantFilter from "./TenantsFilter";
import { CURRENT_PAGE, PER_PAGE } from "../../constant/constant";
import type { FieldData, tenantQueryParams } from "../../utils/types";
import { useAuthStore } from "../../store";
import { debounce } from "lodash";
import TenantForm from "./form/TenantForm";

const Tenants = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tenantQueryParams, setTenantQueryParams] = useState<tenantQueryParams>(
    {
      perPage: PER_PAGE,
      currentPage: CURRENT_PAGE,
      q: "",
    }
  );
  const debouncedQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setTenantQueryParams((prev) => ({ ...prev, q: value }));
    }, 500);
  }, []);

  const {
    data: fetchTenantData,
    isFetching: fetchTenantIsFetching,
    isError: fetchTenantIsError,
    error: fetchTenantError,
  } = FetchTenantsWithPagination(tenantQueryParams);
  console.log(fetchTenantData);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setTenantQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

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
        {fetchTenantData?.data?.tenantGetAllDto ? (
          <>
            <Form form={filterForm} onFieldsChange={onFilterChange}>
              <TenantFilter>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setDrawerOpen(true)}
                >
                  Add Restaurant
                </Button>
              </TenantFilter>
            </Form>
            <Table
              columns={[...TenantTablecolumns]}
              dataSource={fetchTenantData?.data?.tenantGetAllDto}
              rowKey={"id"}
            />
          </>
        ) : (
          <h1>Not Data Found</h1>
        )}

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
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
