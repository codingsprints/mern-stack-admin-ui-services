import { Breadcrumb, Flex, message, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";
import { FetchOrders } from "../../services/order.service";
import { orderTableColumns } from "../../utils/constants/OrderTableColumn";
import { TENANT_ID } from "../../constant/constant";
import React from "react";
import socket from "../../lib/socket";
import {
  Order,
  OrderEvents,
  PaymentMode,
  PaymentStatus,
} from "../../utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { orderQueryKey } from "../../constant/query-keys/order.query-keys";

// todo: make this dynamic.

const Orders = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const queryString = new URLSearchParams({
    tenantId: String(TENANT_ID),
  }).toString();

  const { data: orders } = FetchOrders(queryString);

  React.useEffect(() => {
    if (user?.tenant) {
      // socket.on: "join" emitter lienting from server to client
      // socket.emit: "join" emitter lienting from client to server
      socket.on("order-update", (data) => {
        console.log("order-update ====> ", data);

        // todo: data.event_type =
        if (
          (data.event_type === OrderEvents.ORDER_CREATE &&
            data?.data?.newOrder?.paymentMode === PaymentMode.CASH) ||
          (data.event_type === OrderEvents.PAYMENT_STATUS_UPDATE &&
            data?.data?.newOrder?.paymentStatus === PaymentStatus.PAID &&
            data?.data?.paymentMode === PaymentMode.CARD)
        ) {
          queryClient.setQueryData(
            [orderQueryKey.getAllOrders, queryString],
            (old: Order[]) => [data.data, ...old]
          );
          messageApi.open({
            type: "success",
            content: "New Order Received.",
          });
        }

        console.log("data received: ", data);
      });

      socket.on("join", (data) => {
        console.log("User joined in: ", data.roomId);
      });

      socket.emit("join", {
        tenantId: user.tenant.id,
      });
    }

    return () => {
      socket.off("join");
      socket.off("order-update");
    };
  }, []);

  // const { data: orders } = useQuery({
  //   queryKey: ["orders"],
  //   queryFn: () => {
  //     // If admin user then make sure to send tenantID, or tenant id from selected filter.
  //     const queryString = new URLSearchParams({
  //       tenantId: String(TENANT_ID),
  //     }).toString();
  //     return getOrders(queryString).then((res) => res.data);
  //   },
  // });

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Orders" },
            ]}
          />
        </Flex>

        <Table
          columns={orderTableColumns}
          rowKey={"_id"}
          dataSource={orders?.data?.orderDto}
        />
      </Space>
    </>
  );
};

export default Orders;
