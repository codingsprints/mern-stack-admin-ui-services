import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/login/login";
import NonAuth from "./layouts/NonAuth";
import Dashboard from "./layouts/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <NonAuth />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
