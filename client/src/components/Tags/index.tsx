import React from "react";
import Link from "next/link";
import { useTags } from "@/hooks/useTags";
import style from "./index.module.scss";

export const Tags = () => {
  const tags = useTags();

  return (
    <div className={style.wrapper}>
      <div className={style.title}>标签</div>
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <Link href={`/[tag]`} as={`/` + tag.value}>
              <a>{tag.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
