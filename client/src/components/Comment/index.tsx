import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Comment, Button, Input, Icon, message } from "antd";
import { format } from "timeago.js";
import cls from "classnames";
import { CommentProvider } from "@providers/comment";
import style from "./index.module.scss";

const { TextArea } = Input;

interface ICommemtItemProps {
  articleId: string;
  comment: IComment;
  getComments: () => void;
}
const CommentItem: React.FC<ICommemtItemProps> = ({
  children,
  articleId,
  comment,
  getComments
}) => {
  const [isReply, setReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const addComment = useCallback(() => {
    let regexp = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

    if (!regexp.test(email)) {
      message.error("请输入合法邮箱地址");
      return;
    }

    const data = {
      articleId,
      name,
      email,
      content,
      parentCommentId: comment.id
    };
    setLoading(true);
    CommentProvider.addComment(data).then(() => {
      message.success("评论成功，已提交审核");
      setLoading(false);
      setName("");
      setEmail("");
      setContent("");
      setReply(false);
      getComments();
    });
  }, [name, email, content, getComments]);

  return (
    <Comment
      actions={
        isReply
          ? [
              <Button
                size="small"
                style={{ marginRight: 16 }}
                onClick={() => {
                  setReply(false);
                }}
              >
                收起
              </Button>,
              <Button
                type="primary"
                size="small"
                loading={loading}
                onClick={addComment}
              >
                评论
              </Button>
            ]
          : [
              <span
                className={style.commentActions}
                key="comment-nested-reply-to"
                onClick={() => {
                  setReply(true);
                }}
              >
                <Icon type="message" />
                <span>评论</span>
              </span>
            ]
      }
      author={
        <a>
          <strong>{comment.name} • </strong>
          {format(comment.createAt, "zh_CN")}
        </a>
      }
      avatar={null}
      content={
        <div>
          <div
            className={cls("markdown", style.commentContent)}
            dangerouslySetInnerHTML={{ __html: comment.html }}
          ></div>
          {isReply && (
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  style={{ marginBottom: 16 }}
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                  placeholder="请输入您的称呼"
                ></Input>
              </Col>
              <Col span={12}>
                <Input
                  style={{ marginBottom: 16 }}
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  placeholder="请输入您的邮箱（不会公开）"
                ></Input>
              </Col>
            </Row>
          )}
          {isReply && (
            <TextArea
              placeholder={"请输入您的评论，支持 Markdown"}
              rows={4}
              onChange={e => {
                setContent(e.target.value);
              }}
              value={content}
            />
          )}
        </div>
      }
    >
      {children}
    </Comment>
  );
};

interface IProps {
  articleId: string;
}

const renderCommentList = (articleId, comments = [], getComments) => {
  return (
    <>
      {comments.map(comment => {
        return (
          <CommentItem
            key={comment.id}
            articleId={articleId}
            comment={comment}
            getComments={getComments}
          >
            {comment.children
              ? renderCommentList(articleId, comment.children, getComments)
              : null}
          </CommentItem>
        );
      })}
    </>
  );
};

export const MyComment: React.FC<IProps> = ({ articleId }) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const getComments = () => {
    CommentProvider.getArticleComments(articleId).then(res => {
      setComments(res);
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  const submit = () => {
    let regexp = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

    if (!regexp.test(email)) {
      message.error("请输入合法邮箱地址");
      return;
    }

    const data = { articleId, name, email, content };
    setLoading(true);
    CommentProvider.addComment(data).then(() => {
      message.success("评论成功，已提交审核");
      setLoading(false);
      setName("");
      setEmail("");
      setContent("");

      getComments();
    });
  };

  return (
    <div>
      <Comment
        avatar={null}
        content={
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  style={{ marginBottom: 16 }}
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                  placeholder="请输入您的称呼"
                ></Input>
              </Col>
              <Col span={12}>
                <Input
                  style={{ marginBottom: 16 }}
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  placeholder="请输入您的邮箱（不会公开）"
                ></Input>
              </Col>
            </Row>
            <TextArea
              style={{ marginBottom: 16 }}
              placeholder={"请输入评论，支持 Markdown"}
              rows={4}
              onChange={e => {
                setContent(e.target.value);
              }}
              value={content}
            />
            <Button
              loading={loading}
              onClick={submit}
              type="primary"
              disabled={!name || !email || !content}
            >
              提交评论
            </Button>
          </div>
        }
      />
      {renderCommentList(articleId, comments, getComments)}
    </div>
  );
};
