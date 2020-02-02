import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleProvider } from "@providers/article";
import style from "./index.module.scss";

export const RecentArticles = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);

  useEffect(() => {
    ArticleProvider.getArticles(true).then(res => {
      setArticles(res);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>最新文章</div>
      <ul>
        {articles.slice(0, 5).map(article => (
          <li key={article.id}>
            <Link href={`/article/` + article.id}>
              <a>{article.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
