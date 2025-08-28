import { useMutation, useQuery } from "@tanstack/react-query";
import { authQueryKeys } from "../constant/query-keys/auth.query-keys";
import { axiosInstance } from "../utils/axios";
import { authEndpoint } from "../constant/api-endpoint/auth.api-endpoint";
import type { Credentials } from "../utils/types";
import type { AxiosError } from "axios";

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

      if (err.response) {
        console.log("Data:", err);
        console.log("Data:", err?.response?.data?.error[0]?.message);
        callbackError(err?.response?.data?.error[0]?.message);
      } else {
        callbackError(err.message);
      }
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
    enabled: false,
  });
};
