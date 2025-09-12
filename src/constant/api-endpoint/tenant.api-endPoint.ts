import type { tenantQueryParams } from "../../utils/types";
import { AUTH_SERVICE } from "../constant";
export const tenantEndPoint = {
  fetchTenantsWithPagination: (queryParams: tenantQueryParams) =>
    `${AUTH_SERVICE}/tenants?perPage=${queryParams?.perPage || 6}&currentPage=${
      queryParams?.currentPage || 1
    }&q=${queryParams?.q || ""}`,

  fetchTenants: `${AUTH_SERVICE}/tenants?perPage=1000&currentPage=1`,
  createTenants: `${AUTH_SERVICE}/tenants`,
  updateTenant: (id: string) => `${AUTH_SERVICE}/tenants/${id}`,
  deleteTenant: (id: string) => `${AUTH_SERVICE}/tenants/${id}`,
};
