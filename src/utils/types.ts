export type Credentials = {
  email: string;
  password: string;
};

interface TenantStore {
  id: number;
  name: string;
  address: string;
}

export interface UserStore {
  id: number;
  fullName: string;
  email: string;
  role: string;
  tenant?: TenantStore;
}

export interface AuthState {
  user: null | UserStore;
  setUser: (user: UserStore) => void;
  logout: () => void;
}

// users api types
export type Tenant = {
  id: number;
  name: string;
  address: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  tenant: Tenant | null;
};

export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
};

export type FieldData = {
  name: string[];
  value?: string;
};

export type userQueryParams = {
  perPage: number;
  currentPage: number;
  q?: string;
  role?: string;
};

export type tenantQueryParams = {
  perPage: number;
  currentPage: number;
  q?: string;
};

export type productQueryParams = {
  perPage: number;
  currentPage: number;
  q?: string;
  tenantId?: number;
  categoryId?: string;
};

export type CreateTenantsType = {
  name: string;
  address: string;
};

export type ProductsFilterProps = {
  children?: React.ReactNode;
  isPublish: boolean;
  setIsPublish: (isPublish: boolean) => void;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export type ProductAttribute = {
  name: string;
  value: string | boolean;
};

export type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: Category;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttribute[];
  isPublish: boolean;
  createdAt: string;
};

export type ImageField = { file: File };
export type CreateProductData = Product & { image: ImageField };

export enum OrderStatus {
  RECEIVED = "received",
  CONFIRMED = "confirmed",
  PREPARED = "prepared",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum PaymentMode {
  CARD = "card",
  CASH = "cash",
}

export type Topping = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export interface CartItem
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
}
export interface Order {
  _id: string;
  image: any;
  cart: CartItem[];
  customerId: Customer;
  total: number;
  discount: number;
  taxes: number;
  deliveryCharges: number;
  address: string;
  tenantId: string;
  comment?: string;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
}

export enum OrderEvents {
  ORDER_CREATE = "ORDER_CREATE",
  PAYMENT_STATUS_UPDATE = "PAYMENT_STATUS_UPDATE",
  ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE",
}

export interface ApiErrorResponse {
  error?: { message?: string }[];
}
