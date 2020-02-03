import React, { useState, useMemo, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col, message } from "antd";
import cls from "classnames";
import { Layout } from "@/layout/Layout";
import { ArticleProvider } from "@providers/article";
import { ArticleListItem } from "@components/ArticleListItem";
import style from "./index.module.scss";
import { TagProvider } from "@/providers/tag";

interface IHomeProps {
  articles: IArticle[];
  currentTag: string;
  tags: ITag[];
}

let hideLoading: any = () => {};

function isEqual(_arr1, _arr2) {
  if (
    !Array.isArray(_arr1) ||
    !Array.isArray(_arr2) ||
    _arr1.length !== _arr2.length
  )
    return false;

  var arr1 = _arr1.concat().sort();
  var arr2 = _arr2.concat().sort();

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

const Home: NextPage<IHomeProps> = ({
  articles: defaultArticles = [],
  currentTag: defaultCurrentTag = null,
  tags = []
}) => {
  const router = useRouter();
  const { tag: routerTag } = router.query;
  const [loading, setLoaing] = useState<boolean>(false);
  const [articles, setArticles] = useState<IArticle[]>(defaultArticles);

  const handleClickTag = path => {
    if (loading) {
      return;
    }

    router.push(path);
  };

  useEffect(() => {
    if (loading) {
      hideLoading = message.loading("文章加载中", 0);
    } else {
      hideLoading && hideLoading();
    }
  }, [loading]);

  // 监听路由变化
  // 标签发生变化后重新拉取文章列表
  useEffect(() => {
    if (routerTag) {
      setLoaing(true);

      TagProvider.getTagWithArticles(routerTag, true)
        .then(res => {
          setArticles(res.articles || []);
          setLoaing(false);
        })
        .catch(err => setLoaing(false));
    } else {
      let isSame =
        articles &&
        defaultArticles &&
        isEqual(
          articles.map(a => a.id),
          defaultArticles.map(a => a.id)
        );

      if (isSame) {
        return;
      }

      setLoaing(true);

      ArticleProvider.getArticles(true)
        .then(res => {
          setArticles(res);
          setLoaing(false);
        })
        .catch(err => setLoaing(false));
    }
  }, [routerTag]);

  return (
    <Layout backgroundColor="#fff">
      <Row>
        <Col md={4} sm={24}>
          <aside>
            {/* S 标签列表 */}
            <ul className={style.tagContainer}>
              <li
                key={"all"}
                className={cls(
                  style.tagItem,
                  routerTag == null ? style.active : false
                )}
              >
                <a
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    handleClickTag("/");
                  }}
                >
                  <img
                    src="http://wipi.oss-cn-shanghai.aliyuncs.com/2020-02-01/CHRKH77JJNS9OEL8DKPXPF/all.png"
                    alt=""
                  />
                  <span>全部</span>
                </a>
              </li>
              {tags.map(tag => {
                return (
                  <li
                    key={tag.id}
                    className={cls(
                      style.tagItem,
                      routerTag === tag.label ? style.active : false
                    )}
                  >
                    {/* <Link href={"/?tag=" + tag.label} shallow> */}
                    <a
                      href={"/?tag=" + tag.label}
                      onClick={e => {
                        e.preventDefault();
                        handleClickTag("/?tag=" + tag.label);
                      }}
                    >
                      <img src={tag.icon} alt="icon" />
                      <span>{tag.label}</span>
                    </a>
                    {/* </Link> */}
                  </li>
                );
              })}
            </ul>
            {/* E 标签列表 */}
          </aside>
        </Col>
        <Col md={20} sm={24}>
          {routerTag && (
            <div className={style.tagTitle}>
              <h5>{routerTag}</h5>
            </div>
          )}
          <div className={style.articleContainer}>
            {articles.map(article => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

// 服务端预取数据
Home.getInitialProps = async ctx => {
  const { tag } = ctx.query;
  const [articles, tags] = await Promise.all([
    tag
      ? TagProvider.getTagWithArticles(tag, true)
          .then(res => res.articles)
          .catch(() => {
            return [] as any;
          })
      : ArticleProvider.getArticles(true),
    TagProvider.getTags()
  ]);

  return { articles, tags, currentTag: tag as string };
};

export default Home;
