import { RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Space, Table } from "antd";
import { Link } from "react-router-dom";
import { FetchUser } from "../../services/user.service";
import { userTableColumns } from "../../components/users/UsersTable";
import type { User } from "../../utils/types";

const Users = () => {
  const { data: fetchUserData } = FetchUser();
  console.log(fetchUserData);

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
