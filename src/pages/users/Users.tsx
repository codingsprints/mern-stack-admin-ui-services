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
import { createUser, FetchUser } from "../../services/user.service";
import { userTableColumns } from "../../components/users/UsersTable";
import type { FieldData, User, userQueryParams } from "../../utils/types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useMemo, useState } from "react";
import UserForm from "./form/UserForm";
import { CURRENT_PAGE, PER_PAGE } from "../../constant/constant";

const Users = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );
  const [queryParams, setQueryParams] = useState<userQueryParams>({
    perPage: PER_PAGE,
    currentPage: CURRENT_PAGE,
    q: "",
    role: "",
  });
  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: fetchUserData,
    isFetching: fetchDataIsFetching,
    isError: fetchDataIsError,
    error: fetchDataError,
  } = FetchUser(queryParams);
  console.log(fetchUserData);

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
      setQueryParams((prev) => ({
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
        {fetchUserData?.data?.getAllUsersDto ? (
          <>
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
              pagination={{
                total: fetchUserData?.data?.total,
                pageSize: queryParams.perPage,
                current: queryParams.currentPage,
                onChange: (page) => {
                  console.log(page);
                  setQueryParams((prev) => {
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
          </>
        ) : (
          <h1>Not Data Found</h1>
        )}
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
