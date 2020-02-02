import React, { useState, useEffect, useCallback } from "react";
import { NextPage } from "next";
import { Button, Input, message } from "antd";
import { AdminLayout } from "@/layout/AdminLayout";
import { FileSelectDrawer } from "@/components/admin/FileSelectDrawer";
import { ArticleSettingDrawer } from "@/components/admin/ArticleSettingDrawer";
import { ArticleProvider } from "@providers/article";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import style from "./index.module.scss";

interface IProps {
  article: IArticle;
}

const Editor: NextPage<IProps> = ({ article: defaultArticle = {} }) => {
  const [mounted, setMounted] = useState(false);
  const [fileDrawerVisible, setFileDrawerVisible] = useState(false);
  const [settingDrawerVisible, setSettingDrawerVisible] = useState(false);
  const [id, setId] = useState(defaultArticle.id || null);
  const [article, setArticle] = useState<any>(defaultArticle);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  const save = useCallback(() => {
    if (!article.title) {
      message.warn("至少输入文章标题");
      return;
    }

    article.status = "draft";

    if (id) {
      ArticleProvider.updateArticle(id, article).then(res => {
        setId(res.id);
        message.success("文章已保存");
      });
    } else {
      ArticleProvider.addArticle(article).then(res => {
        setId(res.id);
        message.success("文章已保存");
      });
    }
  }, [article, id]);

  const preview = useCallback(() => {
    if (id) {
      window.open("/article/" + id);
    } else {
      message.warn("请先保存");
    }
  }, [id]);

  const publish = useCallback(() => {
    let canPublish = true;
    void [
      ["title", "请输入文章标题"],
      ["summary", "请输入文章摘要"],
      ["content", "请输入文章内容"]
    ].forEach(([key, msg]) => {
      if (!article[key]) {
        message.warn(msg);
        canPublish = false;
      }
    });

    if (!canPublish) {
      return;
    }

    setSettingDrawerVisible(true);
  }, [article, id]);

  const saveOrPublish = patch => {
    const data = Object.assign({}, article, patch);

    const handle = res => {
      setId(res.id);
      message.success(data.status === "draft" ? "文章已保存" : "文章已发布");
    };

    if (id) {
      ArticleProvider.updateArticle(id, data).then(handle);
    } else {
      ArticleProvider.addArticle(data).then(handle);
    }
  };

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <Input
          placeholder="请输入文章标题"
          // value={article.title}
          defaultValue={article.title}
          onChange={e => {
            setArticle(article => {
              const value = e.target.value;
              article.title = value;
              return article;
            });
          }}
        />
        <Input.TextArea
          className={style.formItem}
          placeholder="请输入文章摘要"
          autoSize={{ minRows: 3, maxRows: 6 }}
          defaultValue={article.summary}
          onChange={e => {
            setArticle(article => {
              const value = e.target.value;
              article.summary = value;
              return article;
            });
          }}
        />
        {mounted && (
          <SimpleMDE
            className={style.formItem}
            value={article.content}
            onChange={value => {
              setArticle(article => {
                article.content = value;
                return article;
              });
            }}
          />
        )}
        <FileSelectDrawer
          isCopy={true}
          closeAfterClick={true}
          visible={fileDrawerVisible}
          onClose={() => {
            setFileDrawerVisible(false);
          }}
        />
        <ArticleSettingDrawer
          article={article}
          visible={settingDrawerVisible}
          onClose={() => setSettingDrawerVisible(false)}
          onChange={saveOrPublish}
        />
        <div className={style.operation}>
          <Button
            type="dashed"
            onClick={() => {
              setFileDrawerVisible(true);
            }}
          >
            文件库
          </Button>
          <Button onClick={save}>保存</Button>
          <Button onClick={preview}>预览</Button>
          <Button type="primary" onClick={publish}>
            发布
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

Editor.getInitialProps = async ctx => {
  const { id } = ctx.query;
  const article = await ArticleProvider.getArticle(id);
  return { article };
};

export default Editor;
