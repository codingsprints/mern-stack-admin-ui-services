import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { selfUserRoot } from "../services/auth.service";

const Root = () => {
  const { setUser } = useAuthStore();

  const { data: selfUserData, isLoading: selfUserIsLoading } = selfUserRoot();

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
