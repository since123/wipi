import React from "react";
import { NextPage } from "next";
import { Row } from "antd";
import { TagProvider } from "@/providers/tag";
import { Layout } from "@/layout/Layout";
import { TagMenus } from "@components/TagMenus";
import { ArticleList } from "@components/ArticleList";
import style from "./index.module.scss";

interface IHomeProps {
  articles: IArticle[];
}

const Home: NextPage<IHomeProps> = ({ articles = [] }) => {
  return (
    <Layout backgroundColor="#fff">
      <TagMenus />
      <Row className={style.articleList}>
        <ArticleList articles={articles} />
      </Row>
    </Layout>
  );
};

// 服务端预取数据
Home.getInitialProps = async ctx => {
  const { tag } = ctx.query;
  const [articles] = await Promise.all([
    TagProvider.getTagWithArticles(tag, true).then(res => res.articles)
  ]);

  return { articles };
};

export default Home;
