export const AUTH_SERVICE = `/pizza/auth/api/v1`;
export const CATALOG_SERVICE = `/pizza/catalog/api/v1`;
export const ORDER_SERVICE = `/pizza/order/api/v1`;

export const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  MANAGER: "manager",
};

export const PER_PAGE = 6;

export const CURRENT_PAGE = 1;
export const TENANT_ID = 1;

export const colorMapping = {
  received: "processing",
  confirmed: "orange",
  prepared: "volcano",
  out_for_delivery: "purple",
  delivered: "success",
};

export const list = [
  {
    OrderSummary: "Peperoni, Margarita ...",
    address: "Bandra, Mumbai",
    amount: 1200,
    status: "preparing",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
];

export const orderStatusOptions = [
  {
    value: "received",
    label: "Received",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "prepared",
    label: "Prepared",
  },
  {
    value: "out_for_delivery",
    label: "Out For Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];
