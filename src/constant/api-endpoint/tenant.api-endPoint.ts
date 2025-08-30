import { AUTH_SERVICE } from "../constant";
export const tenantEndPoint = {
  fetchTenants: () => `${AUTH_SERVICE}/tenants`,
};
