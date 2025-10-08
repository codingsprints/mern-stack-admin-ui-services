import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { capitalizeFirst } from "../products/helpers";
import { OrderStatus } from "../../utils/types";
import { format } from "date-fns";
import { colorMapping, orderStatusOptions } from "../../constant/constant";
import { GetSingleOrder, UpdateOrder } from "../../services/order.service";

const SingleOrder = () => {
  const params = useParams();
  const orderId = params.orderId;

  const queryString = new URLSearchParams({
    // todo: think about maybe trim the whitespace.
    fields:
      "cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt",
  }).toString();

  const { data: order, isLoading: orderLoading } = GetSingleOrder(
    orderId!,
    queryString
  );

  const { mutate: updateOrderMutate } = UpdateOrder(orderId!);

  // const { data: order } = useQuery<Order>({
  //   queryKey: ["order", orderId],
  //   queryFn: () => {
  //     const queryString = new URLSearchParams({
  //       // todo: think about maybe trim the whitespace.
  //       fields:
  //         "cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt",
  //     }).toString();
  //     return getSingle(orderId as string, queryString).then((res) => res.data);
  //   },
  // });
  // const queryClient = useQueryClient();

  // const { mutate } = useMutation({
  //   mutationKey: ["order", orderId],
  //   mutationFn: (status: OrderStatus) => {
  //     return changeStatus(orderId as string, { status }).then(
  //       (res) => res.data
  //     );
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["order", orderId] });
  //   },
  // });

  if (!order) {
    return null;
  }

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderMutate(status);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {orderLoading ? (
        <h1>Loading</h1>
      ) : (
        <>
          <Flex justify="space-between">
            <Breadcrumb
              separator={<RightOutlined />}
              items={[
                { title: <Link to="/">Dashboard</Link> },
                { title: <Link to="/orders">Orders</Link> },
                { title: `Order #${order?.data?.orderDto?._id}` },
              ]}
            />

            <Space>
              <Typography.Text>Change Order Status</Typography.Text>
              <Select
                defaultValue={order?.data?.orderDto?.orderStatus}
                style={{
                  width: 150,
                }}
                onChange={handleStatusChange}
                options={orderStatusOptions}
              />
            </Space>
          </Flex>

          <Row gutter={24}>
            <Col span={14}>
              <Card
                title="Order Details"
                extra={
                  <Tag
                    bordered={false}
                    color={
                      order?.data?.orderDto?.orderStatus
                        ? colorMapping[
                            order?.data?.orderDto
                              ?.orderStatus as keyof typeof colorMapping
                          ]
                        : "processing"
                    }
                  >
                    {capitalizeFirst(order?.data?.orderDto?.orderStatus)}
                  </Tag>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={order?.data?.orderDto?.cart}
                  renderItem={(item: any) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item?.image} />}
                        title={item.name}
                        description={item.chosenConfiguration.selectedToppings
                          // todo: IMPORTANT: check why there is a nested array in selected toppings
                          // @ts-ignore
                          .map((topping) => topping.name)
                          .join(", ")}
                      />

                      <Space size={"large"}>
                        <Typography.Text>
                          {Object.values(
                            item.chosenConfiguration.priceConfiguration
                          ).join(", ")}
                        </Typography.Text>

                        <Typography.Text>
                          {item.qty} Item{item.qty > 1 ? "s" : ""}
                        </Typography.Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Customer Details">
                <Space direction="vertical">
                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">Name</Typography.Text>
                    <Typography.Text>
                      {order?.data?.orderDto?.customerId?.firstName +
                        " " +
                        order?.data?.orderDto?.customerId?.lastName}
                    </Typography.Text>
                  </Flex>

                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">Address</Typography.Text>
                    <Typography.Text>
                      {order?.data?.orderDto?.address}
                    </Typography.Text>
                  </Flex>

                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">
                      Payment Method
                    </Typography.Text>
                    <Typography.Text>
                      {order?.data?.orderDto?.paymentMode?.toUpperCase()}
                    </Typography.Text>
                  </Flex>

                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">
                      Payment Status
                    </Typography.Text>
                    <Typography.Text>
                      {capitalizeFirst(order?.data?.orderDto?.paymentStatus)}
                    </Typography.Text>
                  </Flex>

                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">
                      Order Amount
                    </Typography.Text>
                    <Typography.Text>
                      ₹{order?.data?.orderDto?.total}
                    </Typography.Text>
                  </Flex>

                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">
                      Order Time
                    </Typography.Text>
                    <Typography.Text>
                      {format(
                        new Date(order?.data?.orderDto?.createdAt),
                        "dd/MM/yyyy HH:mm"
                      )}
                    </Typography.Text>
                  </Flex>

                  {order.comment && (
                    <Flex style={{ flexDirection: "column" }}>
                      <Typography.Text type="secondary">
                        Comment
                      </Typography.Text>
                      <Typography.Text>
                        {order?.data?.orderDto?.comment}
                      </Typography.Text>
                    </Flex>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Space>
  );
};

export default SingleOrder;
