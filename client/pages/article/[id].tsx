import React, { useState, useEffect, useCallback } from "react";
import { NextPage } from "next";
import Router from "next/router";
import Link from "next/link";
import { Row, Col, Anchor, Modal, Form, Input, message } from "antd";
import { Layout } from "@/layout/Layout";
import { MyComment } from "@/components/Comment";
import { ArticleProvider } from "@providers/article";
import style from "./index.module.scss";

interface IProps {
  article: IArticle;
}

const Article: NextPage<IProps> = ({ article }) => {
  const [tocs, setTocs] = useState([]);
  const [password, setPassword] = useState(null);
  const [shouldCheckPassWord, setShouldCheckPassword] = useState(
    !!article.password
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
    if (typeof tocs === "string") {
      tocs = JSON.parse(tocs);
    }
    setTocs(tocs);
  }, []);

  useEffect(() => {
    if (!shouldCheckPassWord) {
      ArticleProvider.updateArticleViews(article.id);
    }
  }, [shouldCheckPassWord]);

  return (
    <Layout>
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
          <Col sm={18}>
            <div className={style.content}>
              <img className={style.cover} src={article.cover} alt="文章封面" />
              <h1 className={style.title}>{article.title}</h1>
              <div
                className={style.markdown}
                dangerouslySetInnerHTML={{ __html: article.html }}
              ></div>

              <div className={style.tags}>
                <p>标签</p>
                <div>
                  {article.tags.map(tag => {
                    return (
                      <div className={style.tag}>
                        <Link href={"/?tag=" + tag.label}>
                          <a>
                            <img src={tag.icon} alt="icon" />
                            <span>{tag.label}</span>
                          </a>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* S 评论 */}
              {article.isCommentable && (
                <div className={style.comments}>
                  <p className={style.title}>评论</p>
                  <MyComment articleId={article.id} />
                </div>
              )}
              {/* E 评论 */}
            </div>
          </Col>
          {/* S 文章目录 */}
          <Col sm={6}>
            {Array.isArray(tocs) && (
              <div>
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
            )}
          </Col>
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
