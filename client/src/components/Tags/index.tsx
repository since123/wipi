import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { TagProvider } from "@providers/tag";
import style from "./index.module.scss";

let cache = null;

export const Tags = () => {
  const tags = useRef(cache || []);
  const [, setUpdate] = useState(false);

  useEffect(() => {
    if (cache) {
      return;
    }

    TagProvider.getTags().then(res => {
      tags.current = res;
      cache = res;
      setUpdate(true);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>标签</div>
      <ul>
        {tags.current.map(tag => (
          <li key={tag.id}>
            <Link href={`/?tag=` + tag.label}>
              <a>{tag.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
