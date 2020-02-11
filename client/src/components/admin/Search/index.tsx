import React, { useState, useEffect, useCallback } from "react";
import cls from "classnames";
import Link from "next/link";
import { Spin, Icon } from "antd";
import { SearchProvider } from "@providers/search";
import style from "./index.module.scss";

interface IProps {}
let timer = null;

const throttle = (fn, wait) => {
  let inThrottle, lastFn, lastTime;
  return function() {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

export const Search: React.FC<IProps> = () => {
  const [ret, setRet] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);

  const search = useCallback(keyword => {
    if (!keyword) {
      return;
    }

    setLoading(true);
    setHasSearch(true);

    SearchProvider.searchArticles(keyword)
      .then(res => {
        setRet(
          res.map(r => ({
            ...r,
            type: "文章",
            label: r.title,
            pathPrefix: "/admin/article/editor/"
          }))
        );
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

  return (
    <div className={style.wrapper}>
      <span>
        <Icon
          type="search"
          onClick={e => {
            let next = !visible;

            setVisible(next);
            if (!next) {
              setKeyword("");
              setLoading(false);
              setHasSearch(false);
              setRet(null);
            }
          }}
        />
      </span>
      <input
        className={cls(visible ? style.active : false)}
        type="search"
        placeholder="keywords"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onKeyPress={e => {
          if (e.nativeEvent.keyCode === 13) {
            if (keyword) {
              search(keyword);
            }
          }
        }}
      />
      {keyword && (
        <div className={style.ret}>
          {loading && (
            <div className={style.loading}>
              <Spin
                spinning={loading}
                indicator={
                  <Icon type="loading" style={{ fontSize: 24 }} spin />
                }
              />
            </div>
          )}
          {!loading &&
            hasSearch &&
            (ret && ret.length ? (
              <ul>
                {ret.map(r => {
                  return (
                    <li key={r.id}>
                      <Link
                        href={r.pathPrefix + "[id]"}
                        as={r.pathPrefix + r.id}
                        prefetch={false}
                      >
                        <a>
                          {r.type}: {r.label}
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              "暂无搜索结果"
            ))}
        </div>
      )}
    </div>
  );
};
