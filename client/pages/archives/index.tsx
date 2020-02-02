import React, { useState, useMemo, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col, Timeline } from "antd";
import { Layout } from "@/layout/Layout";
import { ArticleProvider } from "@providers/article";
import { RecentArticles } from "@components/RecentArticles";
import { Tags } from "@components/Tags";
import style from "./index.module.scss";

interface IProps {
  articles: { [key: string]: IArticle[] };
}

const ArchiveItem = ({ year, articles = [] }) => {
  return (
    <div className={style.item}>
      <p>{year}</p>
      <Timeline>
        {articles.map(article => (
          <Timeline.Item key={article.id}>
            <Link href={`/article/` + article.id}>
              <a>{article.title}</a>
            </Link>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

const Archives: NextPage<IProps> = ({ articles }) => {
  return (
    <Layout backgroundColor="#fff">
      <Row>
        <Col sm={16}>
          <div className={style.content}>
            {Object.keys(articles).map(year => {
              return (
                <ArchiveItem key={year} year={year} articles={articles[year]} />
              );
            })}
          </div>
        </Col>
        <Col sm={8}>
          <div className={style.widget}>
            <RecentArticles />
          </div>
          <div className={style.widget}>
            <Tags />
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

// 服务端预取数据
Archives.getInitialProps = async ctx => {
  const articles = await ArticleProvider.getArchives();
  return { articles };
};

export default Archives;
