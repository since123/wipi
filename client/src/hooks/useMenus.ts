import React, { useRef, useEffect, useState } from "react";
import { PageProvider } from "@providers/page";

const defaultMenus = [
  {
    label: "首页",
    path: "/"
  },

  {
    label: "归档",
    path: "/archives"
  }
];
let cache = null;

export const useMenus = () => {
  const [, setMounted] = useState(false);
  const value = useRef(cache);

  useEffect(() => {
    if (!cache) {
      PageProvider.getAllPublisedPages().then(res => {
        const arr = res.map(r => ({ path: `/page/` + r.path, label: r.name }));
        value.current = arr;
        cache = arr;
        setMounted(true);
      });
    }
  }, []);

  return value.current ? [...defaultMenus, ...value.current] : defaultMenus;
};
