import React from "react";
import { NextPage } from "next";
import { Row } from "antd";
import { Layout } from "@/layout/Layout";
import { ArticleProvider } from "@providers/article";
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
Home.getInitialProps = async () => {
  const [articles] = await Promise.all([ArticleProvider.getArticles(true)]);
  return { articles };
};

export default Home;
