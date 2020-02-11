import React, { useState, useCallback } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Table, Button, Tag, Divider, Badge, Popconfirm, message } from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { ArticleProvider } from "@providers/article";
import style from "./index.module.scss";

const columns = [
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
    render: (text, record) => (
      <Link href={`/article/[id]`} as={`/article/${record.id}`}>
        <a target="_blank">{text}</a>
      </Link>
    )
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: status => {
      const isDraft = status === "draft";
      return (
        <Badge
          color={isDraft ? "gold" : "green"}
          text={isDraft ? "草稿" : "已发布"}
        />
      );
    }
  },
  {
    title: "阅读量",
    dataIndex: "views",
    key: "views",
    render: views => (
      <Badge
        count={views}
        showZero={true}
        overflowCount={999}
        style={{ backgroundColor: "#52c41a" }}
      />
    )
  },
  {
    title: "标签",
    key: "tags",
    dataIndex: "tags",
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.label.length > 2 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag.label}>
              {tag.label}
            </Tag>
          );
        })}
      </span>
    )
  },
  {
    title: "发布时间",
    dataIndex: "publishAt",
    key: "publishAt",
    render: date => dayjs.default(date).format("YYYY-MM-DD HH:mm:ss")
  }
];

interface IArticleProps {
  articles: IArticle[];
}

const Article: NextPage<IArticleProps> = ({
  articles: defaultArticles = []
}) => {
  const router = useRouter();
  const [articles, setArticles] = useState<IArticle[]>(defaultArticles);

  const getArticles = useCallback(() => {
    ArticleProvider.getArticles().then(articles => {
      setArticles(articles);
    });
  }, []);

  const deleteArticle = useCallback(id => {
    ArticleProvider.deleteArticle(id).then(() => {
      message.success("文章删除成功");
      getArticles();
    });
  }, []);

  const actionColumn = {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <span className={style.action}>
        <Link
          href={`/admin/article/editor/[id]`}
          as={`/admin/article/editor/` + record.id}
        >
          <a>编辑</a>
        </Link>
        <Divider type="vertical" />
        <Popconfirm
          title="确认删除这个文章？"
          onConfirm={() => deleteArticle(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>
      </span>
    )
  };

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <Button
          className={style.createBtn}
          type="primary"
          icon="plus"
          onClick={() => router.push(`/admin/article/editor`)}
        >
          写文章
        </Button>
        <Table
          columns={[...columns, actionColumn]}
          dataSource={articles}
          rowKey={"id"}
        />
      </div>
    </AdminLayout>
  );
};

Article.getInitialProps = async () => {
  const articles = await ArticleProvider.getArticles();
  return { articles };
};

export default Article;
