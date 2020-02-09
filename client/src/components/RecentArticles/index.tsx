import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArticleProvider } from "@providers/article";
import style from "./index.module.scss";

let cache = null;

export const RecentArticles = () => {
  const articles = useRef(cache || []);
  const [, setUpdate] = useState(false);

  useEffect(() => {
    if (cache) {
      return;
    }

    ArticleProvider.getArticles(true).then(res => {
      articles.current = res;
      cache = res;
      setUpdate(true);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>最新文章</div>
      <ul>
        {articles.current.slice(0, 5).map(article => (
          <li key={article.id}>
            <Link href={`/article/` + article.id} prefetch={false}>
              <a>{article.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
