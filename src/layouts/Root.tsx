import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { selfUserRoot } from "../services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../utils/axios";
import { authEndpoint } from "../constant/api-endpoint/auth.api-endpoint";

const Root = () => {
  const { setUser } = useAuthStore();

  const { data: selfUserData, isLoading: selfUserIsLoading } = useQuery({
    queryKey: ["selfUserData"],
    queryFn: () => axiosInstance.get(authEndpoint.selfRoot),
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (selfUserData) {
      setUser(selfUserData?.data?.data?.selfDto);
    }
  }, [selfUserData, setUser]);

  if (selfUserIsLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default Root;
