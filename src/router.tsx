import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/login/login";
import NonAuth from "./layouts/NonAuth";
import Dashboard from "./layouts/Dashboard";
import Root from "./layouts/Root";

export const router = createBrowserRouter([
  // Maintaining Authentication user State on Page Refresh
  {
    path: "/",
    element: <Root />,
    children: [
      {
        // protected router - login then access
        path: "",
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
        // not protected router - without login
        path: "/auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
