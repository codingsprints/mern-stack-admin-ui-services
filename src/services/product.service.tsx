// eslint-disable-next-line @typescript-eslint/no-explicit-any
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import type { productQueryParams } from "../utils/types";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { productQueryKey } from "../constant/query-keys/products.query-keys";
import { productEndPoint } from "../constant/api-endpoint/products.api-endpoint";

export const FetchProductsWithPagination = (
  queryParams: productQueryParams,
  productIsPubliced: boolean
) => {
  return useQuery({
    queryKey: [productQueryKey.fetchproducts, queryParams, productIsPubliced],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        productEndPoint.fetchProducts(queryParams, productIsPubliced)
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const FetchSingleProduct = (id: string) => {
  return useQuery({
    queryKey: [productQueryKey.fetchsingleproduct],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        productEndPoint.fetchSingleProduct(id)
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const CreateProducts = (
  callbackCreateTenantSuccess: () => void,
  callbackCreateTenantFailure: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [productQueryKey.createproducts],
    mutationFn: async (details: any) => {
      const { data } = await axiosInstance.post(
        productEndPoint.createProducts,
        details,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess() {
      callbackCreateTenantSuccess();
      queryClient.invalidateQueries({
        queryKey: [productQueryKey.fetchproducts],
      });
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

export const UpdateProduct = (
  id: string,
  callbackUpdateTenantSuccess: () => void,
  callbackUpdateTenantFailure: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [productQueryKey.updateproducts],
    mutationFn: async (details: any) => {
      const { data } = await axiosInstance.put(
        productEndPoint.updateProducts(id),
        details,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [productQueryKey.fetchproducts],
      });
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

export const DeleteProduct = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [productQueryKey.deleteproducts],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(
        productEndPoint.deleteProducts(id)
      );
      return data;
    },
    onSuccess() {
      toast.success("Product delete successfully!!!");
      //   queryClient.invalidateQueries({
      //     queryKey: [productQueryKey.fetchproducts],
      //   });
    },
    onError(error) {
      const err = error as AxiosError<any>; // cast error to AxiosError

      if (err?.response?.data?.error) {
        toast.error(err?.response?.data?.error[0]?.message);
      } else {
        toast.error(err.message);
      }
    },
  });
};
