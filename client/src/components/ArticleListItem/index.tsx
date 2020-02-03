import React from "react";
import cls from "classnames";
import Link from "next/link";
import * as dayjs from "dayjs";
import style from "./index.module.scss";

interface IArticleListItemProps {
  article: IArticle;
}

export const ArticleListItem: React.FC<IArticleListItemProps> = ({
  article
}) => {
  return (
    <article className={style.wrapper}>
      <div className={style.meta}>
        {dayjs.default(article.publishAt).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <p className={style.title}>
        <Link href={`/article/` + article.id}>
          <a>{article.title}</a>
        </Link>
      </p>
      <div className={cls(style.summary, article.cover && style.withCover)}>
        <div dangerouslySetInnerHTML={{ __html: article.summary }}></div>
        {article.cover && (
          <div
            className={style.cover}
            style={{ backgroundImage: `url(${article.cover})` }}
          />
        )}
      </div>
    </article>
  );
};
