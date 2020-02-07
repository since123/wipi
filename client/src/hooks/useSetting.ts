import React, { useRef, useEffect, useState } from "react";
import { SettingProvider } from "@providers/setting";

let cache = null;

export const useSetting = () => {
  const [, setMounted] = useState(false);
  const value = useRef(cache || {});

  useEffect(() => {
    if (!cache) {
      console.log(111);
      SettingProvider.getSetting().then(res => {
        value.current = res;
        cache = res;
        setMounted(true);
      });
    }
  }, []);

  return value.current;
};
