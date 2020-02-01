import React, { useState, useMemo } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
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
  const [currentTag, setTag] = useState<string | null>(defaultCurrentTag);
  const [articles, setArticles] = useState<IArticle[]>(defaultArticles);

  // 标签发生变化后重新拉取文章列表
  useMemo(() => {
    if (currentTag) {
      TagProvider.getTagWithArticles(currentTag).then(res => {
        setArticles(res.articles || []);
      });
    } else {
      setArticles(defaultArticles);
    }
  }, [currentTag]);

  return (
    <Layout backgroundColor="#fff">
      <Row>
        <Col md={4}>
          <aside>
            {/* S 标签列表 */}
            <ul>
              <li
                key={"all"}
                className={cls(
                  style.tagItem,
                  currentTag === null ? style.active : false
                )}
                onClick={() => setTag(null)}
              >
                <img
                  src="http://wipi.oss-cn-shanghai.aliyuncs.com/2020-02-01/CHRKH77JJNS9OEL8DKPXPF/all.png"
                  alt=""
                />
                <span>全部</span>
              </li>
              {tags.map(tag => {
                return (
                  <li
                    key={tag.id}
                    className={cls(
                      style.tagItem,
                      currentTag === tag.label ? style.active : false
                    )}
                    onClick={() => {
                      router.push("/", "/?tag=" + tag.label, { shallow: true });
                      setTag(tag.label);
                    }}
                  >
                    <img src={tag.icon} alt="icon" />
                    <span>{tag.label}</span>
                  </li>
                );
              })}
            </ul>
            {/* E 标签列表 */}
          </aside>
        </Col>
        <Col md={20}>
          {currentTag && (
            <div className={style.tagTitle}>
              <h5>{currentTag}</h5>
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
  const articles = tag
    ? await TagProvider.getTagWithArticles(tag).then(res => res.articles)
    : await ArticleProvider.getArticles();
  const tags = await TagProvider.getTags();
  return { articles, tags, currentTag: tag as string };
};

export default Home;
