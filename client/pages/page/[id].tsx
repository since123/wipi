import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import { Row, Col, Anchor } from "antd";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import { Layout } from "@/layout/Layout";
import { MyComment } from "@/components/Comment";
import { RecentArticles } from "@components/RecentArticles";
import { PageProvider } from "@providers/page";
import style from "./index.module.scss";

interface IProps {
  page: IPage;
}

const Page: NextPage<IProps> = ({ page }) => {
  const ref = useRef(null);
  const [tocs, setTocs] = useState([]);

  useEffect(() => {
    if (!page) {
      return;
    }

    let tocs = JSON.parse(page.toc);
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

  // 高亮
  useEffect(() => {
    if (ref.current) {
      hljs.initHighlightingOnLoad();
      hljs.highlightBlock(ref.current);
    }
  }, []);

  return (
    <Layout backgroundColor="#fff">
      {!page ? (
        <p>页面不存在</p>
      ) : (
        <Row gutter={16}>
          <Col sm={24} className={style.container}>
            <div className={style.meta}>
              {page.cover && (
                <img className={style.cover} src={page.cover} alt="文章封面" />
              )}
            </div>
            <div className={style.content}>
              <div
                ref={ref}
                className={"markdown"}
                dangerouslySetInnerHTML={{ __html: page.html }}
              ></div>

              <div className={style.comments}>
                <p className={style.title}>评论</p>
                <div className={style.commentContainer}>
                  <MyComment articleId={page.id} isInPage={true} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Layout>
  );
};

Page.getInitialProps = async ctx => {
  const { id } = ctx.query;
  const page = await PageProvider.getPage(id);
  return { page };
};

export default Page;
