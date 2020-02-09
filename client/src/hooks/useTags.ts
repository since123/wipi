import React, { useRef, useEffect, useState } from "react";
import { TagProvider } from "@providers/tag";

let cache = null;

export const useTags = () => {
  const [, setMounted] = useState(false);
  const value = useRef(cache || []);

  useEffect(() => {
    if (!cache) {
      TagProvider.getTags().then(res => {
        value.current = res;
        cache = res;
        setMounted(true);
      });
    }
  }, []);

  return value.current;
};
