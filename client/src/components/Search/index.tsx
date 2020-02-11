import React, { useState, useCallback, useEffect, useRef } from "react";
import cls from "classnames";
import { Spin } from "antd";
import { SearchProvider } from "@providers/search";
import { ArticleList } from "@components/ArticleList";
import style from "./index.module.scss";

interface IProps {
  visible: boolean;
  onClose: () => void;
}
let timer = null;

export const Search: React.FC<IProps> = ({ visible = false, onClose }) => {
  const ref = useRef(null);
  const [articles, setArticles] = useState<IArticle[] | null>(null);
  const [keyword, setKeyword] = useState("");
  const [hasSearch, setHasSearch] = useState(null);
  const [loading, setLoading] = useState(false);

  const getArticles = useCallback(keyword => {
    setLoading(true);
    SearchProvider.searchArticles(keyword)
      .then(res => {
        console.log(res);
        const ret = res.filter(r => r.status === "publish" && !r.needPassword);
        console.log(ret);
        setHasSearch(true);
        setArticles(ret);
        timer = setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible || !ref.current) {
      return;
    }

    ref.current.focus();
  }, [visible]);

  return (
    <div
      className={cls(
        style.container,
        visible ? style.active : false,
        articles && articles.length ? style.hasResult : false
      )}
    >
      <div className={cls(style.wrapper, hasSearch ? style.active : false)}>
        <div className={cls(style.search, hasSearch ? style.active : false)}>
          <input
            ref={ref}
            type="search"
            placeholder="keywords"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyPress={e => {
              if (e.nativeEvent.keyCode === 13) {
                if (keyword) {
                  getArticles(keyword);
                }
              }
            }}
          />
          <button
            onClick={() => {
              setKeyword(null);
              setHasSearch(false);
              onClose && onClose();
            }}
          >
            ×
          </button>

          {loading && (
            <div className={style.loading}>
              <Spin tip="正在搜索中..." spinning={true} />
            </div>
          )}
        </div>
        {hasSearch && !loading && (
          <div className={cls(style.ret, hasSearch ? style.active : false)}>
            {articles && articles.length ? (
              <ArticleList articles={articles} />
            ) : (
              <p className={style.none}>未搜索到数据</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
