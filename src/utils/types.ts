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
