import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authQueryKeys } from "../constant/query-keys/auth.query-keys";
import { axiosInstance } from "../utils/axios";
import { authEndpoint } from "../constant/api-endpoint/auth.api-endpoint";

export const useLogoutUser = (
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
