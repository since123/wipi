import React, { useRef, useEffect, useState } from "react";
import { SettingProvider } from "@providers/setting";

let cache = null;

export const useSetting = () => {
  const [, setMounted] = useState(false);
  const value = useRef(cache || {});

  useEffect(() => {
    if (!cache) {
      SettingProvider.getSetting().then(res => {
        value.current = res;
        cache = res;
        setMounted(true);
      });
    }
  }, []);

  return value.current;
};
