import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet";
import { NextPage } from "next";
import Router from "next/router";
import Link from "next/link";
import cls from "classnames";
import { Row, Col, Anchor, Modal, Form, Input, message } from "antd";
import * as dayjs from "dayjs";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import { useSetting } from "@/hooks/useSetting";
import { Layout } from "@/layout/Layout";
import { MyComment } from "@/components/Comment";
// import { RecentArticles } from "@components/RecentArticles";
import { ArticleProvider } from "@providers/article";
import style from "./index.module.scss";
const url = require("url");

interface IProps {
  article: IArticle;
}

const Article: NextPage<IProps> = ({ article }) => {
  const setting = useSetting();
  const ref = useRef(null);
  const [tocs, setTocs] = useState([]);
  const [password, setPassword] = useState(null);
  const [shouldCheckPassWord, setShouldCheckPassword] = useState(
    article.needPassword
  );

  // 检查文章密码
  const checkPassWord = useCallback(() => {
    ArticleProvider.checkPassword(article.id, password).then(res => {
      if (res.pass) {
        setShouldCheckPassword(false);
      } else {
        message.error("密码错误");
        setShouldCheckPassword(true);
      }
    });
  }, [password]);

  const back = useCallback(() => {
    Router.push("/");
  }, []);

  useEffect(() => {
    let tocs = JSON.parse(article.toc);
    let i = 0;
    let max = 10; // 最大尝试次数
    const handle = () => {
      i++;
      try {
        tocs = JSON.parse(tocs);
      } catch (e) {
        i = max + 1;
      }

      if (typeof tocs === "string" && i < max) {
        handle();
      }
    };

    handle();
    setTocs(tocs);
  }, []);

  // 更新阅读量
  useEffect(() => {
    if (!shouldCheckPassWord) {
      ArticleProvider.updateArticleViews(article.id);
    }
  }, [shouldCheckPassWord]);

  // 高亮
  useEffect(() => {
    if (!shouldCheckPassWord) {
      hljs.initHighlightingOnLoad();
      hljs.highlightBlock(ref.current);
    }
  }, [shouldCheckPassWord]);

  return (
    <Layout backgroundColor="#fff">
      {/* S 密码检验 */}
      <Modal
        title="文章受保护，请输入访问密码"
        cancelText={"回首页"}
        okText={"确认"}
        visible={shouldCheckPassWord}
        onOk={checkPassWord}
        onCancel={back}
      >
        <Form.Item label={"密码"}>
          <Input.Password
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
        </Form.Item>
      </Modal>
      {/* E 密码检验 */}

      {shouldCheckPassWord ? (
        <>
          <p>请输入文章密码</p>
        </>
      ) : (
        <Row gutter={16}>
          <Helmet>
            <title>{article.title + " - " + setting.systemTitle}</title>
          </Helmet>

          <article>
            {setting.systemUrl && (
              <meta
                itemProp="url"
                content={url.resolve(
                  setting.systemUrl,
                  `/article/${article.id}`
                )}
              />
            )}
            <meta itemProp="headline" content={article.title} />
            {article.tags && (
              <meta
                itemProp="keywords"
                content={article.tags.map(tag => tag.label).join(" ")}
              />
            )}
            <meta itemProp="dataPublished" content={article.updateAt} />
            {article.cover && <meta itemProp="image" content={article.cover} />}
            <div className={style.meta}>
              {article.cover && (
                <img
                  className={style.cover}
                  src={article.cover}
                  alt="文章封面"
                />
              )}
              <h1 className={style.title}>{article.title}</h1>
              <p className={style.desc}>
                <span>
                  发布于{" "}
                  {dayjs
                    .default(article.createAt)
                    .format("YYYY-MM-DD HH:mm:ss")}
                </span>
                <span> • </span>
                <span>阅读量 {article.views}</span>
              </p>
            </div>

            <div className={style.content}>
              <div
                ref={ref}
                className={cls("markdown", style.markdown)}
                dangerouslySetInnerHTML={{ __html: article.html }}
              ></div>
              <div className={style.tags}>
                <div>
                  <span>标签：</span>
                  {article.tags.map(tag => {
                    return (
                      <div className={style.tag} key={tag.id}>
                        <Link href={"/?tag=" + tag.label}>
                          <a>
                            <span>{tag.label}</span>
                          </a>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>

          {/* S 评论 */}
          {article.isCommentable && (
            <div className={style.comments}>
              <p className={style.title}>评论</p>
              <div className={style.commentContainer}>
                <MyComment articleId={article.id} />
              </div>
            </div>
          )}
          {/* E 评论 */}

          {/* S 文章目录 */}
          {/* {Array.isArray(tocs) && (
            <div className={style.anchorWidget}>
              <Anchor targetOffset={32} offsetTop={32}>
                {tocs.map(toc => {
                  return (
                    <Anchor.Link
                      key={toc[2]}
                      href={"#" + toc[1]}
                      title={toc[2]}
                    ></Anchor.Link>
                  );
                })}
              </Anchor>
            </div>
          )} */}
          {/* E 文章目录 */}
        </Row>
      )}
    </Layout>
  );
};

Article.getInitialProps = async ctx => {
  const { id } = ctx.query;
  const article = await ArticleProvider.getArticle(id);
  return { article };
};

export default Article;
