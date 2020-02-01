import React, { useState, useCallback, useMemo } from "react";
import { NextPage } from "next";
import {
  Avatar,
  Row,
  Col,
  Card,
  Button,
  Input,
  Popconfirm,
  Tooltip,
  List,
  message
} from "antd";
import cls from "classnames";
import { AdminLayout } from "@/layout/AdminLayout";
import { FileSelectDrawer } from "@/components/admin/FileSelectDrawer";
import { TagProvider } from "@providers/tag";
import style from "./index.module.scss";

interface ITagProps {
  tags: ITag[];
}

const TagPage: NextPage<ITagProps> = ({ tags: defaultTags = [] }) => {
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState(defaultTags);
  const [mode, setMode] = useState("create");
  const [currentTag, setCurrentTag] = useState(null);
  const [newTag, setNewTag] = useState(null);
  const [newIcon, setNewIcon] = useState(null);

  const isCreateMode = useMemo(() => mode === "create", [mode]);

  const getTags = useCallback(() => {
    TagProvider.getTags().then(tags => {
      setTags(tags);
    });
  }, []);

  const reset = useCallback(() => {
    setMode("create");
    setCurrentTag(null);
    setNewIcon(null);
    setNewTag(null);
  }, []);

  const addTag = useCallback(data => {
    if (!data || !data.label) {
      return;
    }

    TagProvider.addTag(data).then(() => {
      message.success("添加标签成功");
      reset();
      getTags();
    });
  }, []);

  const updateTag = useCallback((id, data) => {
    if (!data || !data.label) {
      return;
    }

    TagProvider.updateTag(id, data).then(() => {
      message.success("更新标签成功");
      reset();
      getTags();
    });
  }, []);

  const deleteTag = useCallback(id => {
    TagProvider.deleteTag(id).then(() => {
      message.success("删除标签成功");
      reset();
      getTags();
    });
  }, []);

  return (
    <AdminLayout padding={0} background={"transparent"}>
      <Row gutter={16} className={style.wrapper}>
        <Col sm={9}>
          <Card title={isCreateMode ? "添加标签" : "管理标签"} bordered={true}>
            <Row>
              <Input.Group compact>
                <Col sm={3} onClick={() => setVisible(true)}>
                  <Tooltip placement="top" title={"选择 icon"}>
                    <Avatar
                      style={{ cursor: "pointer" }}
                      shape="square"
                      src={newIcon}
                    />
                  </Tooltip>
                </Col>
                <Col sm={21}>
                  <Input
                    value={newTag}
                    placeholder={"输入标签名称"}
                    onChange={e => {
                      setNewTag(e.target.value);
                    }}
                  ></Input>
                </Col>
              </Input.Group>
            </Row>
            <FileSelectDrawer
              visible={visible}
              onChange={icon => setNewIcon(icon)}
              onClose={() => setVisible(false)}
            />
            <div
              className={cls(style.btns, isCreateMode ? false : style.isEdit)}
            >
              {isCreateMode ? (
                <Button
                  type="primary"
                  onClick={() => addTag({ label: newTag, icon: newIcon })}
                >
                  保存
                </Button>
              ) : (
                <>
                  <Button.Group>
                    <Button
                      type="primary"
                      onClick={() =>
                        updateTag(currentTag.id, {
                          label: newTag,
                          icon: newIcon
                        })
                      }
                    >
                      更新
                    </Button>
                    <Button type="dashed" onClick={() => reset()}>
                      返回添加
                    </Button>
                  </Button.Group>
                  <Popconfirm
                    title="确认删除这个标签？"
                    onConfirm={() => deleteTag(currentTag.id)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button type="danger">删除</Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </Card>
        </Col>
        <Col sm={15}>
          <Card title="所有标签" bordered={true}>
            <List
              grid={{
                gutter: 16,
                sm: 4,
                md: 4
              }}
              dataSource={tags}
              renderItem={tag => (
                <List.Item>
                  <a
                    className={style.tag}
                    onClick={() => {
                      setMode("edit");
                      setCurrentTag(tag);
                      setNewTag(tag.label);
                      setNewIcon(tag.icon);
                    }}
                  >
                    <span className={style.icon}>
                      <img src={tag.icon} alt={tag.label} />
                    </span>
                    <span>{tag.label}</span>
                  </a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

TagPage.getInitialProps = async () => {
  const tags = await TagProvider.getTags();
  return { tags };
};

export default TagPage;
