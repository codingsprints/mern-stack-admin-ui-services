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
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  CreateTenants,
  DeleteTenant,
  FetchTenantsWithPagination,
  UpdateTenant,
} from "../../services/tenants.service";
import { TenantTablecolumns } from "../../utils/constants/TenantTableColumn";
import TenantFilter from "./TenantsFilter";
import { CURRENT_PAGE, PER_PAGE } from "../../constant/constant";
import type { FieldData, tenantQueryParams, User } from "../../utils/types";
import { useAuthStore } from "../../store";
import { debounce } from "lodash";
import TenantForm from "./form/TenantForm";
import { DeleteUser } from "../../services/user.service";
import { toast } from "react-toastify";

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

  const [currentEditingTenant, setCurrentEditingTenant] = useState<User | null>(
    null
  );
  const [currentUserID, setCurrentUserID] = useState<string>("0");

  const callbackCreateTentantFailure = (message: string) => {
    toast.error(message);
  };

  const callbackCreateTentantSuccess = () => {
    form.resetFields();
    setCurrentEditingTenant(null);
    toast.success("create Tenants  successfully!!!");
    setDrawerOpen(false);
  };

  const callbackUpdateTenantFailure = (message: string) => {
    toast.error(message);
  };

  const callbackUpdateTenantSuccess = () => {
    form.resetFields();
    setCurrentEditingTenant(null);
    toast.success("update Tenant successfully!!!");
    setDrawerOpen(false);
  };

  const {
    data: fetchTenantData,
    isFetching: fetchTenantIsFetching,
    isError: fetchTenantIsError,
    error: fetchTenantError,
  } = FetchTenantsWithPagination(tenantQueryParams);
  console.log(fetchTenantData);
  const { mutate: tenantMutate } = CreateTenants(
    callbackCreateTentantSuccess,
    callbackCreateTentantFailure
  );
  const { mutate: updateTenantMutation } = UpdateTenant(
    currentUserID,
    callbackUpdateTenantSuccess,
    callbackUpdateTenantFailure
  );
  const { mutate: deleteTentantMutation } = DeleteTenant();

  useEffect(() => {
    if (currentEditingTenant) {
      form.setFieldsValue({
        ...currentEditingTenant,
        tenantId: currentEditingTenant?.tenant?.id,
      });
      setDrawerOpen(true);
    }
  }, [currentEditingTenant, form]);

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

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

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditingTenant;
    if (isEditMode) {
      updateTenantMutation(form.getFieldsValue());
    } else {
      tenantMutate(form.getFieldsValue());
    }
    // form.resetFields();
    // setCurrentEditingTenant(null);
    // setDrawerOpen(false);
  };

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
          columns={[
            ...TenantTablecolumns,
            {
              title: "Actions",
              render: (_: string, record: User) => {
                return (
                  <>
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => {
                          console.log(record);
                          setCurrentUserID(record?.id);
                          setCurrentEditingTenant(record);
                        }}
                      >
                        Edit
                      </Button>
                    </Space>
                    <Space>
                      <Button
                        type="link"
                        onClick={() => {
                          console.log(record);

                          const confirm = window.confirm(
                            "Are You Sure Delete User?"
                          );
                          console.log(confirm);
                          if (confirm) {
                            deleteTentantMutation(record?.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Space>
                  </>
                );
              },
            },
          ]}
          dataSource={fetchTenantData?.data?.tenantGetAllDto}
          rowKey={"id"}
          pagination={{
            total: fetchTenantData?.data?.total,
            pageSize: fetchTenantData?.data?.perPage,
            current: fetchTenantData?.data?.currentPage,
            onChange: (page) => {
              console.log(page);
              setTenantQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              console.log(total, range);
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />

        <Drawer
          title={currentEditingTenant ? "Edit restaurant" : "Create restaurant"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          //   destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setCurrentEditingTenant(null);
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setCurrentEditingTenant(null);
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
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
