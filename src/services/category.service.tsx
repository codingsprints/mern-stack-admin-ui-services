// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
import { categoryQueryKey } from "../constant/query-keys/categories.query-keys";
import { categoriesEndPoint } from "../constant/api-endpoint/categories.api-endpoint";

export const FetchCategories = () => {
  return useQuery({
    queryKey: [categoryQueryKey.fetchcategories],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        categoriesEndPoint.fetchCategories
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const FetchSingleCategory = (id: string) => {
  return useQuery({
    queryKey: [categoryQueryKey.fetchsinglecategory],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        categoriesEndPoint.fetchSingleCategory(id)
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
  // const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [categoryQueryKey.createcategories],
    mutationFn: async (details: CreateTenantsType) => {
      const { data } = await axiosInstance.post(
        categoriesEndPoint.createCategories,
        details
      );
      return data;
    },
    onSuccess() {
      callbackCreateTenantSuccess();
      // queryClient.invalidateQueries({
      //   queryKey: [categoryQueryKey.fetchcategories],
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

export const UpdateCategories = (
  id: string,
  callbackUpdateTenantSuccess: () => void,
  callbackUpdateTenantFailure: (message: string) => void
) => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [categoryQueryKey.updatecategories],
    mutationFn: async (details: CreateTenantsType) => {
      const { data } = await axiosInstance.patch(
        categoriesEndPoint.updateCategories(id),
        details
      );
      return data;
    },
    onSuccess() {
      // queryClient.invalidateQueries({
      //   queryKey: [categoryQueryKey.fetchcategories],
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

export const DeleteCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [categoryQueryKey.deletecategories],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(
        categoriesEndPoint.deleteCategories(id)
      );
      return data;
    },
    onSuccess() {
      toast.success("Category delete successfully!!!");
      queryClient.invalidateQueries({
        queryKey: [categoryQueryKey.fetchcategories],
      });
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
