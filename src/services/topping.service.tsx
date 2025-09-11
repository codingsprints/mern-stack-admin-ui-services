import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import type { CreateTenantsType } from "../utils/types";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { toppingQueryKey } from "../constant/query-keys/topping.query-keys";
import { toppingEndPoint } from "../constant/api-endpoint/topping.api-endpoint";

export const FetchToppings = () => {
  return useQuery({
    queryKey: [toppingQueryKey.fetchtoppings],
    queryFn: async () => {
      const { data } = await axiosInstance.get(toppingEndPoint.fetchToppings);
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const FetchSingleTopping = (id: string) => {
  return useQuery({
    queryKey: [toppingQueryKey.fetchsingletopping],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        toppingEndPoint.fetchSingleTopping(id)
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const CreateToppings = (
  callbackCreateTenantSuccess: () => void,
  callbackCreateTenantFailure: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [toppingQueryKey.createtoppings],
    mutationFn: async (details: CreateTenantsType) => {
      const { data } = await axiosInstance.post(
        toppingEndPoint.createToppings,
        details
      );
      return data;
    },
    onSuccess() {
      callbackCreateTenantSuccess();
      // queryClient.invalidateQueries({
      //   queryKey: [toppingQueryKey.fetchtoppings],
      // });
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err?.response?.data?.error[0]?.message) {
        callbackCreateTenantFailure(err?.response?.data?.error[0]?.message);
      } else if (err?.response?.data?.errors[0]?.msg) {
        callbackCreateTenantFailure(err?.response?.data?.errors[0]?.msg);
      } else {
        callbackCreateTenantFailure(err?.message);
      }
    },
  });
};

export const UpdateToppings = (
  id: string,
  callbackUpdateTenantSuccess: () => void,
  callbackUpdateTenantFailure: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [toppingQueryKey.updatetoppings],
    mutationFn: async (details: CreateTenantsType) => {
      const { data } = await axiosInstance.patch(
        toppingEndPoint.updateToppings(id),
        details
      );
      return data;
    },
    onSuccess() {
      // queryClient.invalidateQueries({
      //   queryKey: [toppingQueryKey.fetchtoppings],
      // });
      callbackUpdateTenantSuccess();
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err?.response?.data?.error[0]?.message) {
        callbackUpdateTenantFailure(err?.response?.data?.error[0]?.message);
      } else if (err?.response?.data?.errors[0]?.msg) {
        callbackUpdateTenantFailure(err?.response?.data?.errors[0]?.msg);
      } else {
        callbackUpdateTenantFailure(err?.message);
      }
    },
  });
};

export const DeleteToppings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [toppingQueryKey.deletetoppings],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(
        toppingEndPoint.deleteToppings(id)
      );
      return data;
    },
    onSuccess() {
      toast.success("Topping delete successfully!!!");
      // queryClient.invalidateQueries({
      //   queryKey: [toppingQueryKey.fetchtoppings],
      // });
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
