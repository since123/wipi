import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cls from "classnames";
import { useTags } from "@/hooks/useTags";
import style from "./index.module.scss";

export const TagMenus = () => {
  const tags = useTags();
  const router = useRouter();
  const { tag: routerTag } = router.query;

  return (
    <div className={style.tagList}>
      {/* S 标签列表 */}
      <ul>
        <li
          key={"all"}
          className={cls(style.tagItem, !routerTag ? style.active : false)}
        >
          <Link href="/">
            <a>
              <span>全部</span>
            </a>
          </Link>
        </li>
        {tags.map(tag => {
          return (
            <li
              key={tag.id}
              className={cls(
                style.tagItem,
                routerTag === tag.value ? style.active : false
              )}
            >
              <Link href="/[tag]" as={`/` + tag.value}>
                <a>
                  <span>{tag.label}</span>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      {/* E 标签列表 */}
    </div>
  );
};
