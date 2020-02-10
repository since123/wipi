import React, { useState, useCallback } from "react";
import { NextPage } from "next";
import Link from "next/link";
import {
  Row,
  Col,
  Button,
  Table,
  Divider,
  Badge,
  Popconfirm,
  Modal,
  Input,
  message
} from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { CommentProvider } from "@/providers/comment";
import { SettingProvider } from "@/providers/setting";
import style from "./index.module.scss";

interface IProps {
  comments: IComment[];
  setting: any;
}

const Comment: NextPage<IProps> = ({
  comments: defaultComments = [],
  setting
}) => {
  const [comments, setComments] = useState<IComment[]>(defaultComments);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyContent, setReplyContent] = useState(null);

  // 查看 html
  const [htmlVisible, setHTMLVisible] = useState(false);

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

  // 回复评论
  const replayComment = useCallback(comment => {
    setSelectedComment(comment);
  }, []);

  const reply = useCallback(() => {
    if (!replyContent) {
      return;
    }

    const userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));

    const reply = selectedComment.email;
    const data = {
      reply,
      isInPage: selectedComment.isInPage,
      parentCommentId: selectedComment.id,
      articleId: selectedComment.articleId,
      name: userInfo.name || "作者",
      email: userInfo.mail || (setting && setting.smtpFromUser),
      content: replyContent
    };
    CommentProvider.addComment(data).then(() => {
      setSelectedComment(null);
      message.success("回复成功");
      setReplyContent("");
      getComments();
    });
  }, [selectedComment, replyContent]);

  // 删除评论
  const deleteComment = useCallback(id => {
    CommentProvider.deleteComment(id).then(() => {
      message.success("评论删除成功");
      getComments();
    });
  }, []);

  const columns = [
    {
      title: "称呼",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "联系方式",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "内容",
      dataIndex: "html",
      key: "html",
      width: 160,
      render: (_, record) => (
        <Button
          type="link"
          style={{ paddingLeft: 0 }}
          onClick={() => {
            setSelectedComment(record);
            setHTMLVisible(true);
          }}
        >
          点击查看
        </Button>
      )
    },
    {
      title: "父级评论",
      dataIndex: "parentCommentId",
      key: "parentCommentId",
      render: id => {
        const target = comments.find(c => c.id === id);
        return (target && target.name) || "无";
      }
    },
    {
      title: "评论文章",
      dataIndex: "articleId",
      key: "articleId",
      render: (articleId, record) => {
        return articleId ? (
          <Link
            href={`/${record.isInPage ? "page" : "article"}/[id]`}
            as={`/${record.isInPage ? "page" : "article"}/` + articleId}
          >
            <a target="_blank">前往查看</a>
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
        <a onClick={() => replayComment(record)}>回复</a>
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
        <Row style={{ marginBottom: 16 }}>
          <Col sm={24} style={{ textAlign: "right" }}>
            <Button onClick={getComments} icon="reload">
              刷新
            </Button>
          </Col>
        </Row>
        <Table
          columns={[...columns, actionColumn]}
          dataSource={comments}
          rowKey={"id"}
        />
        <Modal
          title={"回复评论"}
          visible={selectedComment && !htmlVisible}
          cancelText={"取消"}
          okText={"回复"}
          onOk={reply}
          onCancel={() => setSelectedComment(null)}
        >
          <Input.TextArea
            rows={10}
            placeholder="支持 Markdown"
            value={replyContent}
            onChange={e => {
              let val = e.target.value;
              setReplyContent(val);
            }}
          ></Input.TextArea>
        </Modal>
        <Modal
          title={"评论详情"}
          visible={htmlVisible}
          footer={null}
          onCancel={() => {
            setSelectedComment(null);
            setHTMLVisible(false);
          }}
        >
          <div
            className="markdown"
            dangerouslySetInnerHTML={{
              __html: selectedComment && selectedComment.html
            }}
          ></div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

Comment.getInitialProps = async () => {
  const [comments, setting] = await Promise.all([
    CommentProvider.getComments(),
    SettingProvider.getSetting()
  ]);
  return { comments, setting };
};

export default Comment;
