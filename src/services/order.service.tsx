// eslint-disable-next-line @typescript-eslint/no-explicit-any
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { orderQueryKey } from "../constant/query-keys/order.query-keys";
import { axiosInstance } from "../utils/axios";
import { orderEndPoint } from "../constant/api-endpoint/order.api-endpoint";
import { OrderStatus } from "../utils/types";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const FetchOrders = (queryString: string) => {
  return useQuery({
    queryKey: [orderQueryKey.getAllOrders, queryString],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        orderEndPoint.getAllOrders(queryString)
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const GetSingleOrder = (id: string, queryString: string) => {
  return useQuery({
    queryKey: [orderQueryKey.getSingleOrder, id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        orderEndPoint.getSingleOrder(id, queryString)
      );
      return data;
    },
  });
};

export const UpdateOrder = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [orderQueryKey.updateOrder, id],
    mutationFn: async (status: OrderStatus) => {
      const { data } = await axiosInstance.patch(
        orderEndPoint.updateOrder(id),
        { status }
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({
        queryKey: [orderQueryKey.getSingleOrder],
      });
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      toast.error(err?.response?.data?.error?.message);
    },
  });
};
