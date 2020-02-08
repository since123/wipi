import React, { useState, useEffect, useCallback } from "react";
import { NextPage } from "next";
import { Button, Input, Icon, message } from "antd";
import { AdminLayout } from "@/layout/AdminLayout";
import { FileSelectDrawer } from "@/components/admin/FileSelectDrawer";
import { PageProvider } from "@providers/page";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import style from "./index.module.scss";

interface IProps {
  page: IPage;
}

const Editor: NextPage<IProps> = ({ page: defaultPage = {} }) => {
  const [mounted, setMounted] = useState(false);
  const [fileDrawerVisible, setFileDrawerVisible] = useState(false);
  const [id, setId] = useState(defaultPage.id);
  const [page, setPage] = useState<any>(defaultPage);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  const save = useCallback(() => {
    if (!page.name) {
      message.warn("请输入页面名称");
      return;
    }

    page.status = "draft";

    if (id) {
      return PageProvider.updatePage(id, page).then(res => {
        setId(res.id);
        message.success("页面已保存");
      });
    } else {
      return PageProvider.addPage(page).then(res => {
        setId(res.id);
        message.success("页面已保存");
      });
    }
  }, [page, id]);

  const preview = useCallback(() => {
    if (id) {
      window.open("/page/" + id);
    } else {
      message.warn("请先保存");
    }
  }, [id]);

  const publish = useCallback(() => {
    let canPublish = true;
    void [
      ["name", "请输入页面名称"],
      ["path", "请输入页面路径"],
      ["content", "请输入页面内容"]
    ].forEach(([key, msg]) => {
      if (!page[key]) {
        message.warn(msg);
        canPublish = false;
      }
    });

    if (!canPublish) {
      return;
    }

    page.status = "publish";

    if (id) {
      return PageProvider.updatePage(id, page).then(res => {
        setId(res.id);
        message.success("页面已保存");
      });
    } else {
      return PageProvider.addPage(page).then(res => {
        setId(res.id);
        message.success("页面已保存");
      });
    }
  }, [page, id]);

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <Input
          placeholder="请输入页面封面"
          addonAfter={
            <Icon
              type="file-image"
              onClick={() => {
                setFileDrawerVisible(true);
              }}
            />
          }
          defaultValue={page.cover}
          onChange={e => {
            setPage(page => {
              const value = e.target.value;
              page.cover = value;
              return page;
            });
          }}
        />
        <Input
          style={{ marginTop: 16 }}
          placeholder="请输入页面名称"
          defaultValue={page.name}
          onChange={e => {
            setPage(page => {
              const value = e.target.value;
              page.name = value;
              return page;
            });
          }}
        />
        <Input
          style={{ marginTop: 16 }}
          placeholder="请输入页面路径"
          defaultValue={page.path}
          onChange={e => {
            setPage(page => {
              const value = e.target.value;
              page.path = value;
              return page;
            });
          }}
        />
        {mounted && (
          <SimpleMDE
            className={style.formItem}
            value={page.content}
            onChange={value => {
              setPage(page => {
                page.content = value;
                return page;
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
  const page = await PageProvider.getPage(id);
  return { page };
};

export default Editor;
