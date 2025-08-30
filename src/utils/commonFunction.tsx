import Icon, { BellFilled, UserAddOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import Home from "../components/icons/Home";
import { foodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import UserIcon from "../components/icons/UserIcon";

export const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to="/">Home</NavLink>,
    },
    {
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to="/users">User</NavLink>,
    },

    {
      key: "/products",
      icon: <Icon component={foodIcon} />,
      label: <NavLink to="/products">Products</NavLink>,
    },
    {
      key: "/orders",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to="/orders">Orders</NavLink>,
    },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to="/promos">Promos</NavLink>,
    },
  ];

  //   if (role === "admin") {
  //     const menus = [...baseItems];
  //     menus.splice(1, 0, {
  //       key: "/users",
  //       icon: <Icon component={UserIcon} />,
  //       label: <NavLink to="/users">Users</NavLink>,
  //     });
  //     menus.splice(2, 0, {
  //       key: "/restaurants",
  //       icon: <Icon component={foodIcon} />,
  //       label: <NavLink to="/restaurants">Restaurants</NavLink>,
  //     });

  //     return menus;
  //   }

  return baseItems;
};
