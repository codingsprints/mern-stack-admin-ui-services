import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const Dashboard = () => {
  // call getself
  const { user } = useAuthStore();

  if (user === null) {
    return (
      <Navigate
        to={`/auth/login`}
        // to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  return (
    <div>
      <h1>Dashboard Components</h1>

      <Outlet />
    </div>
  );
};

export default Dashboard;
