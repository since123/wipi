import React, { useContext } from "react";

export const defaultMenus = [
  {
    label: "首页",
    path: "/"
  },

  {
    label: "归档",
    path: "/archives"
  }
];

const defaultValue: { menus: any } = { menus: defaultMenus };
export const context = React.createContext(defaultValue);
export const { Provider, Consumer } = context;

export const useMenus = () => {
  const { menus } = useContext(context);
  return menus;
};
