import {
  Layout,
  Card,
  Space,
  Form,
  Input,
  Checkbox,
  Button,
  Flex,
  Alert,
} from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";
import { loginUser, logoutUser, selfUser } from "../../services/auth.service";
import { zodValidator } from "../../utils/validator";
import { loginSchema } from "../../schema/login.schema";
import type { Credentials } from "../../utils/types";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store";
import { usePermission } from "../../hooks/usePermission";

const LoginPage = () => {
  const { setUser, logout: logoutFromStore } = useAuthStore();
  const { isAllowed } = usePermission();

  const callbackLoginSuccess = async () => {
    //self api calling
    // store in user state
    const selfDataPromise = await selfRefetch();

    //logout or redirect to clint UI
    // window.location.href = "http://clientui/url";

    // admin, manager and customer
    // customer can not access

    if (!isAllowed(selfDataPromise?.data?.data?.selfDto)) {
      logoutUserMuate();
      return;
    }

    setUser(selfDataPromise.data?.data?.selfDto);

    // toast.success("Logged in successfully!");
  };

  const callbackLoginError = (message: string) => {
    toast.error(message);
  };

  const callbackLogOutSuccess = async () => {
    logoutFromStore();
    return;
  };

  const callbackLogOutError = async (message: string) => {
    toast.error(message);
  };

  const { mutate: loginUserMutate, isPending: loginIsPending } = loginUser(
    callbackLoginSuccess,
    callbackLoginError
  );

  const { mutate: logoutUserMuate } = logoutUser(
    callbackLogOutSuccess,
    callbackLogOutError
  );

  const { refetch: selfRefetch } = selfUser();

  const handlerSubmit = (values: Credentials) => {
    try {
      const parsed = loginSchema.parse(values); // full validation
      loginUserMutate(parsed);
    } catch (err) {
      toast.error(`Validation failed: ${err}`);
    }
  };

  return (
    <>
      {/* <h1>Sign in</h1>
      <input type="text" placeholder="Username" />
      <input type="text" placeholder="Password" />
      <button name="Log in">Log in</button>
      <label htmlFor="remember-me">Remember me</label>
      <input type="checkbox" id="remember-me" />
      <a href="#">Forgot password</a> */}

      <Layout
        style={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Space direction="vertical" align="center" size="large">
          <Layout.Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo />
          </Layout.Content>
          <Card
            variant="borderless"
            style={{ width: 300 }}
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 16,
                  justifyContent: "center",
                }}
              >
                <LockFilled />
                Sign in
              </Space>
            }
          >
            <Form
              initialValues={{
                remember: true,
                // username: "test",
                // password: "test",
              }}
              onFinish={handlerSubmit}
            >
              {/* {loginIsError && (
                <Alert
                  style={{ marginBottom: 24 }}
                  type="error"
                  message={logginError?.message}
                />
              )} */}

              <Form.Item
                name="email"
                rules={[
                  {
                    validator: zodValidator("email"),
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    validator: zodValidator("password"),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Flex justify="space-between">
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="" id="login-form-forgot">
                  Forgot password
                </a>
              </Flex>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={loginIsPending}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
