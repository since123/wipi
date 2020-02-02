import React, { useState, useMemo, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col } from "antd";
import cls from "classnames";
import { Layout } from "@/layout/Layout";
import { ArticleProvider } from "@providers/article";
import { ArticleListItem } from "@components/ArticleListItem";
import style from "./index.module.scss";
import { TagProvider } from "@/providers/tag";

interface IHomeProps {
  articles: IArticle[];
  currentTag: string;
  tags: ITag[];
}

const Home: NextPage<IHomeProps> = ({
  articles: defaultArticles = [],
  currentTag: defaultCurrentTag = null,
  tags = []
}) => {
  const router = useRouter();
  const { tag: routerTag } = router.query;
  const [articles, setArticles] = useState<IArticle[]>(defaultArticles);

  // 监听路由变化
  // 标签发生变化后重新拉取文章列表
  useMemo(() => {
    if (routerTag) {
      TagProvider.getTagWithArticles(routerTag, true).then(res => {
        setArticles(res.articles || []);
      });
    } else {
      setArticles(defaultArticles);
    }
  }, [routerTag]);

  return (
    <Layout backgroundColor="#fff">
      <Row>
        <Col md={4} sm={24}>
          <aside>
            {/* S 标签列表 */}
            <ul className={style.tagContainer}>
              <li
                key={"all"}
                className={cls(
                  style.tagItem,
                  routerTag == null ? style.active : false
                )}
              >
                <Link href="/" shallow>
                  <a>
                    <img
                      src="http://wipi.oss-cn-shanghai.aliyuncs.com/2020-02-01/CHRKH77JJNS9OEL8DKPXPF/all.png"
                      alt=""
                    />
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
                      routerTag === tag.label ? style.active : false
                    )}
                  >
                    <Link href={"/?tag=" + tag.label} shallow>
                      <a>
                        <img src={tag.icon} alt="icon" />
                        <span>{tag.label}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* E 标签列表 */}
          </aside>
        </Col>
        <Col md={20} sm={24}>
          {routerTag && (
            <div className={style.tagTitle}>
              <h5>{routerTag}</h5>
            </div>
          )}
          <div>
            {articles.map(article => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

// 服务端预取数据
Home.getInitialProps = async ctx => {
  const { tag } = ctx.query;
  const [articles, tags] = await Promise.all([
    tag
      ? TagProvider.getTagWithArticles(tag, true)
          .then(res => res.articles)
          .catch(() => {
            return [] as any;
          })
      : ArticleProvider.getArticles(true),
    TagProvider.getTags()
  ]);

  return { articles, tags, currentTag: tag as string };
};

export default Home;
