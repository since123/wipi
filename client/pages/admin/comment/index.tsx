import React, { useState, useCallback } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { Table, Divider, Badge, Popconfirm, message } from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { CommentProvider } from "@/providers/comment";
import style from "./index.module.scss";

interface IProps {
  comments: IComment[];
}

const Comment: NextPage<IProps> = ({ comments: defaultComments = [] }) => {
  const [comments, setComments] = useState<IComment[]>(defaultComments);

  // 获取评论
  const getComments = useCallback(() => {
    CommentProvider.getComments().then(res => {
      setComments(res);
    });
  }, []);

  // 修改评论
  const updateComment = useCallback((comment, pass = false) => {
    CommentProvider.updateComment(comment.id, { pass }).then(() => {
      message.success(pass ? "评论已通过" : "评论已拒绝");
      getComments();
    });
  }, []);

  // 删除评论
  const deleteComment = useCallback(id => {
    CommentProvider.deleteComment(id).then(() => {
      message.success("评论删除成功");
      getComments();
    });
  }, []);

  const columns = [
    {
      title: "联系方式",
      dataIndex: "contact",
      key: "contact"
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      width: 160
    },
    {
      title: "父级评论",
      dataIndex: "parentCommentId",
      key: "parentCommentId",
      render: id => {
        const target = comments.find(c => c.id === id);
        return (target && target.contact) || "无";
      }
    },
    {
      title: "评论文章",
      dataIndex: "articleId",
      key: "articleId",
      render: (_, record) => {
        const article = record.article;
        return article ? (
          <Link href={`/article/` + article.id}>
            <a>{article.title}</a>
          </Link>
        ) : (
          "文章不存在，可能已经被删除"
        );
      }
    },
    {
      title: "状态",
      dataIndex: "pass",
      key: "pass",
      render: pass => (
        <Badge
          color={!pass ? "gold" : "green"}
          text={!pass ? "未通过" : "通过"}
        />
      )
    },
    {
      title: "创建时间",
      dataIndex: "createAt",
      key: "createAt",
      render: date => dayjs.default(date).format("YYYY-MM-DD HH:mm:ss")
    }
  ];

  const actionColumn = {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <span>
        <a onClick={() => updateComment(record, true)}>通过</a>
        <Divider type="vertical" />
        <a onClick={() => updateComment(record, false)}>拒绝</a>
        <Divider type="vertical" />
        <Popconfirm
          title="确认删除这个评论？"
          onConfirm={() => deleteComment(record.id)}
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
        <Table
          columns={[...columns, actionColumn]}
          dataSource={comments}
          rowKey={"id"}
        />
      </div>
    </AdminLayout>
  );
};

Comment.getInitialProps = async () => {
  const comments = await CommentProvider.getComments();
  return { comments };
};

export default Comment;
