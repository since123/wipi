import React, { useContext } from "react";

const defaultValue: { setting: any } = { setting: {} };
export const context = React.createContext(defaultValue);
export const { Provider, Consumer } = context;

export const useSetting = () => {
  const { setting } = useContext(context);
  return setting;
};
