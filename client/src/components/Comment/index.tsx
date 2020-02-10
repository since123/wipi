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
  isInPage?: boolean; // 为 true 时，评论组件在动态页面而非文章
  depth?: number; // 第几层嵌套
  parentComment?: IComment | null; // 父级评论
}

const Editor = ({
  articleId,
  isInPage = false,
  parentCommentId,
  onSuccess = () => {},
  renderFooter = null
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    let userInfo: any = window.localStorage.getItem("commentUser");

    try {
      userInfo = JSON.parse(userInfo);
      setName(userInfo.name);
      setEmail(userInfo.email);
    } catch (err) {}
  }, [loading]);

  const submit = () => {
    let regexp = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

    if (!regexp.test(email)) {
      message.error("请输入合法邮箱地址");
      return;
    }

    const data = { articleId, name, email, content, parentCommentId, isInPage };

    setLoading(true);
    CommentProvider.addComment(data).then(() => {
      message.success("评论成功，已提交审核");
      setLoading(false);
      setName("");
      setEmail("");
      setContent("");
      window.localStorage.setItem(
        "commentUser",
        JSON.stringify({ name, email })
      );
      onSuccess();
    });
  };

  return (
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
      {renderFooter ? (
        renderFooter({ loading, submit, disabled: !name || !email || !content })
      ) : (
        <Button
          loading={loading}
          onClick={submit}
          type="primary"
          disabled={!name || !email || !content}
        >
          提交评论
        </Button>
      )}
    </div>
  );
};

const CommentItem: React.FC<ICommemtItemProps> = ({
  children,
  articleId,
  comment,
  getComments,
  isInPage = false,
  depth = 1,
  parentComment = null
}) => {
  const [isReply, setReply] = useState(false);

  return (
    <Comment
      style={depth > 2 ? { marginLeft: -44 } : {}}
      actions={null}
      author={
        <a>
          <strong>{comment.name}</strong>
          {parentComment ? (
            <>
              {" reply "}
              <strong>{parentComment.name}</strong>
            </>
          ) : null}
          {" • "}
          <span>{format(comment.createAt, "zh_CN")}</span>
        </a>
      }
      avatar={null}
      content={
        <div>
          <div
            className={cls("markdown", style.commentContent)}
            dangerouslySetInnerHTML={{ __html: comment.html }}
          ></div>
          {isReply ? (
            <Editor
              articleId={articleId}
              isInPage={isInPage}
              parentCommentId={comment.id}
              onSuccess={() => {
                getComments();
                setReply(false);
              }}
              renderFooter={({ disabled, loading, submit }) => {
                return (
                  <>
                    <Button
                      size="small"
                      style={{ marginRight: 16 }}
                      onClick={() => {
                        setReply(false);
                      }}
                    >
                      收起
                    </Button>
                    ,
                    <Button
                      type="primary"
                      size="small"
                      loading={loading}
                      disabled={disabled}
                      onClick={() => {
                        submit();
                      }}
                    >
                      评论
                    </Button>
                  </>
                );
              }}
            />
          ) : (
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
  isInPage?: boolean; // 为 true 时，评论组件在动态页面而非文章
}

const renderCommentList = (
  articleId,
  comments = [],
  getComments,
  isInPage,
  depth = 0,
  parentComment = null
) => {
  return (
    <>
      {comments.map(comment => {
        return (
          <CommentItem
            key={comment.id}
            articleId={articleId}
            comment={comment}
            getComments={getComments}
            isInPage={isInPage}
            depth={depth}
            parentComment={parentComment}
          >
            {comment.children
              ? renderCommentList(
                  articleId,
                  comment.children,
                  getComments,
                  isInPage,
                  depth + 1,
                  comment
                )
              : null}
          </CommentItem>
        );
      })}
    </>
  );
};

export const MyComment: React.FC<IProps> = ({
  articleId,
  isInPage = false
}) => {
  const [comments, setComments] = useState<IComment[]>([]);

  const getComments = () => {
    CommentProvider.getArticleComments(articleId).then(res => {
      setComments(res);
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      <Comment
        avatar={null}
        content={
          <Editor
            articleId={articleId}
            isInPage={isInPage}
            parentCommentId={null}
            onSuccess={getComments}
          />
        }
      />
      {renderCommentList(articleId, comments, getComments, isInPage)}
    </div>
  );
};
