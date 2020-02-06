import React, { useState, useEffect, useCallback, useRef } from "react";
import { NextPage } from "next";
import Router from "next/router";
import Link from "next/link";
import { Row, Col, Anchor, Modal, Form, Input, message } from "antd";
import * as dayjs from "dayjs";
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

  const back = useCallback(() => {
    Router.push("/");
  }, []);

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

  return !page ? (
    <Layout backgroundColor="#fff">
      <p>页面不存在</p>
    </Layout>
  ) : (
    <Layout backgroundColor="#fff">
      <Row gutter={16}>
        <Col sm={16}>
          <div
            ref={ref}
            className={"markdown"}
            dangerouslySetInnerHTML={{ __html: page.html }}
          ></div>

          <div className={style.comments}>
            <p className={style.title}>评论</p>
            <div className={style.commentContainer}>
              <MyComment articleId={page.id} />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <Row>
            <Col>
              <div className={style.widget}>
                <RecentArticles />
              </div>
            </Col>

            {/* S 文章目录 */}
            <Col>
              {Array.isArray(tocs) && (
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
              )}
            </Col>
            {/* E 文章目录 */}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

Page.getInitialProps = async ctx => {
  const { id } = ctx.query;
  const page = await PageProvider.getPage(id);
  return { page };
};

export default Page;
