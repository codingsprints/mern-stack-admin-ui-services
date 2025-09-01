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

export const FetchUsers = (queryParams: userQueryParams) => {
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

export const SingleFetchUser = (id: string) => {
  return useQuery({
    queryKey: [userQueryKeys.singleFetchUser, id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        userApiService.singleFetchUser(id)
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const createUser = (
  callbackCreateUserSuccess: () => void,
  callbackCreateUserFailure: (message: string) => void
) => {
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
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.fetchUser],
      });
      callbackCreateUserSuccess();
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err?.response?.data?.error[0]?.message) {
        callbackCreateUserFailure(err?.response?.data?.error[0]?.message);
      } else if (err?.response?.data?.errors[0]?.msg) {
        callbackCreateUserFailure(err?.response?.data?.errors[0]?.msg);
      } else {
        callbackCreateUserFailure(err?.message);
      }
    },
  });
};

export const UpdateUser = (
  id: string,
  callbackUpdateUserSuccess: () => void,
  callbackUpdateUserFailure: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [userQueryKeys.updateUser],
    mutationFn: async (details: CreateUserData) => {
      const { data } = await axiosInstance.patch(
        userApiService.updateUser(id),
        details
      );
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.fetchUser],
      });
      callbackUpdateUserSuccess();
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err?.response?.data?.error[0]?.message) {
        callbackUpdateUserFailure(err?.response?.data?.error[0]?.message);
      } else if (err?.response?.data?.errors[0]?.msg) {
        callbackUpdateUserFailure(err?.response?.data?.errors[0]?.msg);
      } else {
        callbackUpdateUserFailure(err?.message);
      }
    },
  });
};

export const DeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [userQueryKeys.deleteUser],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(
        userApiService.deleteUser(id)
      );
      return data;
    },
    onSuccess() {
      toast.success("Tenant delete successfully!!!");
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.fetchUser],
      });
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err?.response?.data?.error) {
        console.log("Data:", err);
        toast.error(err?.response?.data?.error[0]?.message);
      } else {
        toast.error(err.message);
      }
    },
  });
};
