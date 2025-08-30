import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { Link, Navigate } from "react-router-dom";
import { FetchUser } from "../../services/user.service";
import { userTableColumns } from "../../components/users/UsersTable";
import type { User } from "../../utils/types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UserFilter";
import { useState } from "react";

const Users = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: fetchUserData,
    isFetching: fetchDataIsFetching,
    isError: fetchDataIsError,
    error: fetchDataError,
  } = FetchUser();
  console.log(fetchUserData);

  const { user } = useAuthStore();

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
          columns={[...userTableColumns]}
          dataSource={fetchUserData?.data?.getAllUsersDto}
          rowKey={"id"}
        />
      </Space>
    </>
  );
};

export default Users;
