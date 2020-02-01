import React, { useState, useEffect, useCallback } from "react";
import {
  Comment,
  Avatar,
  Form,
  Button,
  List,
  Input,
  Icon,
  message
} from "antd";
import * as dayjs from "dayjs";
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
  const [contact, setContact] = useState("");
  const [content, setContent] = useState("");

  const addComment = useCallback(() => {
    const data = {
      articleId,
      parentCommentId: comment.id,
      contact,
      content
    };

    setLoading(true);
    CommentProvider.addComment(data).then(() => {
      message.success("回复评论成功，正在审核中");
      setLoading(false);
      setReply(false);
      setContact("");
      setContent("");
      getComments();
    });
  }, [contact, content, getComments]);

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
          {comment.contact}{" "}
          {dayjs.default(comment.createAt).format("YYYY-MM-DD HH:mm:ss")}
        </a>
      }
      avatar={
        <Avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
      }
      content={
        <div>
          <div dangerouslySetInnerHTML={{ __html: comment.html }}></div>
          {isReply && (
            <Input
              style={{ marginBottom: 12 }}
              autoFocus
              value={contact}
              onChange={e => {
                setContact(e.target.value);
              }}
              placeholder="请输入您的联系方式"
            ></Input>
          )}
          {isReply && (
            <TextArea
              placeholder={"请输入您的评论"}
              rows={2}
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
  const [contact, setContact] = useState("");
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
    const data = { articleId, contact, content };
    setLoading(true);
    CommentProvider.addComment(data).then(() => {
      message.success("评论成功，已提交审核");
      setLoading(false);
      setContact("");
      setContent("");
      getComments();
    });
  };

  return (
    <div>
      <Comment
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="匿名用户"
          />
        }
        content={
          <div>
            <Input
              style={{ marginBottom: 16 }}
              value={contact}
              onChange={e => {
                setContact(e.target.value);
              }}
              placeholder="请输入您的联系方式"
            ></Input>
            <TextArea
              style={{ marginBottom: 16 }}
              placeholder={"请输入评论"}
              rows={2}
              onChange={e => {
                setContent(e.target.value);
              }}
              value={content}
            />
            <Button
              loading={loading}
              onClick={submit}
              type="primary"
              disabled={!contact || !content}
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
