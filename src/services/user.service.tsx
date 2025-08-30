import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "../constant/query-keys/user.query-keys";
import { axiosInstance } from "../utils/axios";
import { userApiService } from "../constant/api-endpoint/user.api-endpoint";

export const FetchUser = () => {
  return useQuery({
    queryKey: [userQueryKeys.fetchUser],
    queryFn: async () => {
      const { data } = await axiosInstance.get(userApiService.fetchUser());
      return data;
    },
  });
};
