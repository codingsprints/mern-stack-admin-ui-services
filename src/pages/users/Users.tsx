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
import { Link, Navigate } from "react-router-dom";
import { debounce } from "lodash";
import {
  createUser,
  DeleteUser,
  FetchUsers,
  UpdateUser,
} from "../../services/user.service";
import { userTableColumns } from "../../utils/constants/UsersTableColumn";
import type { FieldData, User, userQueryParams } from "../../utils/types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useEffect, useMemo, useState } from "react";
import UserForm from "./form/UserForm";
import { CURRENT_PAGE, PER_PAGE } from "../../constant/constant";
import { toast } from "react-toastify";

const Users = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );
  const [currentUserID, setCurrentUserID] = useState<string>("0");
  const [userQueryParams, setUserQueryParams] = useState<userQueryParams>({
    perPage: PER_PAGE,
    currentPage: CURRENT_PAGE,
    q: "",
    role: "",
  });
  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setUserQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const callbackCreateUserFailure = (message: string) => {
    toast.error(message);
  };

  const callbackCreateUserSuccess = () => {
    form.resetFields();
    setCurrentEditingUser(null);
    toast.success("create user successfully!!!");
    setDrawerOpen(false);
  };

  const callbackUpdateUserFailure = (message: string) => {
    toast.error(message);
  };

  const callbackUpdateUserSuccess = () => {
    form.resetFields();
    setCurrentEditingUser(null);
    toast.success("update user successfully!!!");
    setDrawerOpen(false);
  };

  const { mutate: userMutate } = createUser(
    callbackCreateUserSuccess,
    callbackCreateUserFailure
  );
  const {
    data: fetchUserData,
    isFetching: fetchDataIsFetching,
    isError: fetchDataIsError,
    error: fetchDataError,
  } = FetchUsers(userQueryParams);

  const { mutate: updateUserMutation } = UpdateUser(
    currentUserID,
    callbackUpdateUserSuccess,
    callbackUpdateUserFailure
  );
  const { mutate: deleteUserMutation } = DeleteUser();

  useEffect(() => {
    if (currentEditingUser) {
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser?.tenant?.id,
      });
      setDrawerOpen(true);
    }
  }, [currentEditingUser, form]);

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditingUser;
    if (isEditMode) {
      console.log("update form data", form.getFieldsValue());
      updateUserMutation(form.getFieldsValue());
    } else {
      console.log("form data", form.getFieldsValue());
      userMutate(form.getFieldsValue());
    }
  };

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    console.log(changedFilterFields);
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setUserQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Users" },
            ]}
          />
          {fetchDataIsFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {fetchDataIsError && (
            <Typography.Text type="danger">
              {fetchDataError.message}
            </Typography.Text>
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UsersFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add User
            </Button>
          </UsersFilter>
        </Form>
        <Table
          columns={[
            ...userTableColumns,
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
                          setCurrentEditingUser(record);
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
                            deleteUserMutation(record?.id);
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
          dataSource={fetchUserData?.data?.getAllUsersDto}
          rowKey={"id"}
          pagination={{
            total: fetchUserData?.data?.total,
            pageSize: userQueryParams.perPage,
            current: userQueryParams.currentPage,
            onChange: (page) => {
              console.log(page);
              setUserQueryParams((prev) => {
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
          title={currentEditingUser ? "Edit User" : "Add User"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setCurrentEditingUser(null);
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
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
