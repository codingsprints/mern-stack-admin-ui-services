import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { AxiosError } from "axios";
import { selfUser } from "../services/auth.service";

const Root = () => {
  const { setUser } = useAuthStore();

  const { data: selfUserData, isLoading: selfUserIsLoading } = selfUser();

  useEffect(() => {
    if (selfUserData) {
      setUser(selfUserData);
    }
  }, [selfUserData, setUser]);

  if (selfUserIsLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default Root;
