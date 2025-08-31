import { useQuery } from "@tanstack/react-query";
import { tenantEndPoint } from "../constant/api-endpoint/tenant.api-endPoint";
import { axiosInstance } from "../utils/axios";
import { tenantQueryKeys } from "../constant/query-keys/tenant.query-keys";
import type { tenantQueryParams } from "../utils/types";

export const FetchTenantsWithPagination = (queryParams: tenantQueryParams) => {
  return useQuery({
    queryKey: [tenantQueryKeys.fetchTenantsWithPagination, queryParams],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        tenantEndPoint.fetchTenantsWithPagination(queryParams)
      );
      return data;
    },
  });
};

export const FetchTenants = () => {
  return useQuery({
    queryKey: [tenantQueryKeys.fetchTenants],
    queryFn: async () => {
      const { data } = await axiosInstance.get(tenantEndPoint.fetchTenants);
      return data;
    },
  });
};
