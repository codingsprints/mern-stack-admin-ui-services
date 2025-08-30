import { useQuery } from "@tanstack/react-query";
import { tenantEndPoint } from "../constant/api-endpoint/tenant.api-endPoint";
import { axiosInstance } from "../utils/axios";
import { tenantQueryKeys } from "../constant/query-keys/tenant.query-keys";

export const FetchTenants = () => {
  return useQuery({
    queryKey: [tenantQueryKeys.fetchTenants],
    queryFn: async () => {
      const { data } = await axiosInstance.get(tenantEndPoint.fetchTenants());
      return data;
    },
  });
};
