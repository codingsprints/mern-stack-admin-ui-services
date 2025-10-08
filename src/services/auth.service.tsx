// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useMutation, useQuery } from "@tanstack/react-query";
import { authQueryKeys } from "../constant/query-keys/auth.query-keys";
import { axiosInstance } from "../utils/axios";
import { authEndpoint } from "../constant/api-endpoint/auth.api-endpoint";
import type { Credentials } from "../utils/types";
import { AxiosError } from "axios";

export const loginUser = (
  callbackSuccess: () => void,
  callbackError: (message: string) => void
) => {
  return useMutation({
    mutationKey: [authQueryKeys.loginUser],
    mutationFn: async (details: Credentials) => {
      const { data } = await axiosInstance.post(authEndpoint.login, details);
      return data;
    },
    onSuccess: async () => {
      callbackSuccess();
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err.response?.data?.error[0]?.message) {
        callbackError(err?.response?.data?.error[0]?.message);
      } else if (err.response?.data?.errors[0]?.msg) {
        callbackError(err.response?.data?.errors[0]?.msg);
      } else {
        callbackError(err?.message);
      }
    },
  });
};

export const selfUserRoot = () => {
  return useQuery({
    queryKey: [authQueryKeys.selfUserRoot],
    queryFn: async () => {
      const { data } = await axiosInstance.get(authEndpoint.selfRoot);
      return data;
    },
    // enabled: false,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const selfUser = () => {
  return useQuery({
    queryKey: [authQueryKeys.selfUser],
    queryFn: async () => {
      const { data } = await axiosInstance.get(authEndpoint.self);
      return data;
    },
    // enabled: false,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const logoutUser = (
  callbackLogOutSuccess: () => void,
  callbackLogOutError: (message: string) => void
) => {
  return useMutation({
    mutationKey: [authQueryKeys.logoutUser],
    mutationFn: async () => {
      const { data } = await axiosInstance.post(authEndpoint.logout);
      return data;
    },
    onSuccess: async () => {
      await callbackLogOutSuccess();
    },
    onError: (error) => {
      const err = error as AxiosError<any>;
      if (err.response) {
        callbackLogOutError(
          err?.response?.data?.error?.[0]?.message || "Logout failed"
        );
      } else {
        callbackLogOutError(err.message);
      }
    },
  });
};
