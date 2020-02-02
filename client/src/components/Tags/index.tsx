import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TagProvider } from "@providers/tag";
import style from "./index.module.scss";

export const Tags = () => {
  const [tags, setTags] = useState<ITag[]>([]);

  useEffect(() => {
    TagProvider.getTags().then(res => {
      setTags(res);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>标签</div>
      <ul>
        {tags.map(tag => (
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
