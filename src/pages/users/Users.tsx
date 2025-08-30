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
import { createUser, FetchUser } from "../../services/user.service";
import { userTableColumns } from "../../components/users/UsersTable";
import type { User } from "../../utils/types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./form/UserForm";

const Users = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: fetchUserData,
    isFetching: fetchDataIsFetching,
    isError: fetchDataIsError,
    error: fetchDataError,
  } = FetchUser();

  const { mutate: userMutate } = createUser();

  const { user } = useAuthStore();

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  const onHandleSubmit = async () => {
    await form.validateFields();
    // const isEditMode = !!currentEditingUser;
    // if (isEditMode) {
    //   await updateUserMutation(form.getFieldsValue());
    // } else {
    console.log("form data", form.getFieldsValue());
    await userMutate(form.getFieldsValue());
    // }
    form.resetFields();
    // setCurrentEditingUser(null);
    setDrawerOpen(false);
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
        {/* <Form form={filterForm} onFieldsChange={onFilterChange}> */}
        <UsersFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </UsersFilter>
        {/* </Form> */}
        <Table
          columns={[
            ...userTableColumns,
            {
              title: "Actions",
              render: (_: string, record: User) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentEditingUser(record);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={fetchUserData?.data?.getAllUsersDto}
          rowKey={"id"}
        />

        <Drawer
          title={"Add User"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          destroyOnHidden={true}
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
