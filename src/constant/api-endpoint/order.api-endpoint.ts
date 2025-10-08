import { ORDER_SERVICE } from "../constant";

export const orderEndPoint = {
  getAllOrders: (queryString: string) =>
    `${ORDER_SERVICE}/orders?${queryString}`,
  // createOrder: `${ORDER_SERVICE}/orders`,
  // getOrders: `${ORDER_SERVICE}/orders/mine`,
  getSingleOrder: (id: string, queryString: string) =>
    `${ORDER_SERVICE}/orders/${id}?${queryString}`,
  updateOrder: (id: string) => `${ORDER_SERVICE}/orders/change-status/${id}`,
};
