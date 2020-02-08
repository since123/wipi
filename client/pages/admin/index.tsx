import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { Row, Col, Statistic, List, Card, Avatar } from "antd";
import { AdminLayout } from "@/layout/AdminLayout";
import { ArticleProvider } from "@providers/article";
import { CommentProvider } from "@providers/comment";
import { TagProvider } from "@/providers/tag";
import { FileProvider } from "@/providers/file";
import style from "./index.module.scss";

interface IHomeProps {
  articles: IArticle[];
  tags: ITag[];
  files: IFile[];
  comments: IComment[];
}

const Home: NextPage<IHomeProps> = ({
  articles = [],
  tags = [],
  files = [],
  comments = []
}) => {
  return (
    <AdminLayout background="transparent" padding={0}>
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Statistic
            className={style.listItem}
            title="文章数量"
            value={articles.length}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            className={style.listItem}
            title="标签数量"
            value={tags.length}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            className={style.listItem}
            title="评论数量"
            value={comments.length}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            className={style.listItem}
            title="文件数量"
            value={files.length}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} sm={16}>
          <Card title="最新文章" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={articles.slice(0, 5)}
              renderItem={article => (
                <List.Item
                  extra={
                    article.cover ? (
                      <img width={120} alt="logo" src={article.cover} />
                    ) : null
                  }
                >
                  <List.Item.Meta
                    title={
                      <Link href={`/admin/article/editor/` + article.id}>
                        <a>{article.title}</a>
                      </Link>
                    }
                    description={article.summary}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card title="最新评论" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={comments.slice(0, 5)}
              renderItem={comment => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link href={`/admin/comment/`}>
                        <a>
                          {comment.name} - {comment.email}
                        </a>
                      </Link>
                    }
                    description={comment.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

Home.getInitialProps = async () => {
  const [articles, tags, files, comments] = await Promise.all([
    ArticleProvider.getArticles(),
    TagProvider.getTags(),
    FileProvider.getFiles(),
    CommentProvider.getComments()
  ]);

  return { articles, tags, files, comments };
};

export default Home;
