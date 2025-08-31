import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { userQueryKeys } from "../constant/query-keys/user.query-keys";
import { axiosInstance } from "../utils/axios";
import { userApiService } from "../constant/api-endpoint/user.api-endpoint";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { CreateUserData, userQueryParams } from "../utils/types";

export const FetchUser = (queryParams: userQueryParams) => {
  return useQuery({
    queryKey: [userQueryKeys.fetchUser, queryParams],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        userApiService.fetchUser(queryParams)
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const createUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [userQueryKeys.createUser],
    mutationFn: async (details: CreateUserData) => {
      const { data } = await axiosInstance.post(
        userApiService.createUser,
        details
      );
      return data;
    },
    onSuccess() {
      toast.success("user successfully!!!");
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.fetchUser],
      });
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err.response) {
        console.log("Data:", err);
        toast.error(err?.response?.data?.error[0]?.message);
      } else {
        toast.error(err.message);
      }
    },
  });
};
