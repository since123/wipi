import React, { useState, useCallback } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Table,
  Button,
  Tag,
  Divider,
  Badge,
  Popconfirm,
  Modal,
  Spin,
  message
} from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { ArticleProvider } from "@providers/article";
import style from "./index.module.scss";
import { useSetting } from "@/hooks/useSetting";
import { ViewProvider } from "@/providers/view";
import { ViewChart } from "@/components/admin/ViewChart";
const url = require("url");

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
  const setting = useSetting();
  const [articles, setArticles] = useState<IArticle[]>(defaultArticles);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState<IView[]>([]);

  const getViews = useCallback(url => {
    setLoading(true);
    ViewProvider.getViewsByUrl(url).then(res => {
      setViews(res);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  }, []);

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
        <span
          onClick={() => {
            setVisible(true);
            getViews(url.resolve(setting.systemUrl, "/article/" + record.id));
          }}
        >
          <a>查看访问</a>
        </span>
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
        <Modal
          title="访问统计"
          visible={visible}
          width={640}
          onCancel={() => {
            setVisible(false);
            setViews([]);
          }}
          maskClosable={false}
          footer={null}
        >
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <Spin spinning={loading}></Spin>
            </div>
          ) : (
            <ViewChart data={views} />
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

Article.getInitialProps = async () => {
  const articles = await ArticleProvider.getArticles();
  return { articles };
};

export default Article;
