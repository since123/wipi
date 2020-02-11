import React, { useState, useCallback } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Table, Button, Tag, Divider, Badge, Popconfirm, message } from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { PageProvider } from "@providers/page";
import style from "./index.module.scss";

const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <Link href={`/page/[id]`} as={`/page/${record.path}`}>
        <a target="_blank">{text}</a>
      </Link>
    )
  },
  {
    title: "路径",
    dataIndex: "path",
    key: "path"
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
    title: "发布时间",
    dataIndex: "publishAt",
    key: "publishAt",
    render: date => dayjs.default(date).format("YYYY-MM-DD HH:mm:ss")
  }
];

interface IProps {
  pages: IPage[];
}

const Page: NextPage<IProps> = ({ pages: defaultPages = [] }) => {
  const router = useRouter();
  const [pages, setPages] = useState<IPage[]>(defaultPages);

  const getPages = useCallback(() => {
    PageProvider.getPages().then(pages => {
      setPages(pages);
    });
  }, []);

  const deleteArticle = useCallback(id => {
    PageProvider.deletePage(id).then(() => {
      message.success("页面删除成功");
      getPages();
    });
  }, []);

  const editPage = useCallback((id, data) => {
    PageProvider.updatePage(id, data).then(() => {
      message.success("操作成功");
      getPages();
    });
  }, []);

  const actionColumn = {
    title: "操作",
    key: "action",
    render: (_, record) => {
      const isDraft = record.status === "draft";

      return (
        <span className={style.action}>
          {isDraft ? (
            <a onClick={() => editPage(record.id, { status: "publish" })}>
              启用
            </a>
          ) : (
            <a onClick={() => editPage(record.id, { status: "draft" })}>禁用</a>
          )}
          <Divider type="vertical" />
          <Link
            href={`/admin/page/editor/[id]`}
            as={`/admin/page/editor/` + record.id}
          >
            <a>编辑</a>
          </Link>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除这个页面？"
            onConfirm={() => deleteArticle(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      );
    }
  };

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <Button
          className={style.createBtn}
          type="primary"
          icon="plus"
          onClick={() => router.push(`/admin/page/editor`)}
        >
          新建页面
        </Button>
        <Table
          columns={[...columns, actionColumn]}
          dataSource={pages}
          rowKey={"id"}
        />
      </div>
    </AdminLayout>
  );
};

Page.getInitialProps = async () => {
  const pages = await PageProvider.getPages();
  return { pages };
};

export default Page;
