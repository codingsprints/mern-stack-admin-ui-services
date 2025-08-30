import { RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Space, Table } from "antd";
import { Link, Navigate } from "react-router-dom";
import { FetchUser } from "../../services/user.service";
import { userTableColumns } from "../../components/users/UsersTable";
import type { User } from "../../utils/types";
import { useAuthStore } from "../../store";

const Users = () => {
  const { data: fetchUserData } = FetchUser();
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
          {/* {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )} */}
        </Flex>
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
