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
  List,
  Form,
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
  const [label, setLabel] = useState(null);
  const [value, setValue] = useState(null);
  const [icon, setIcon] = useState(null);

  const isCreateMode = useMemo(() => mode === "create", [mode]);

  const getTags = useCallback(() => {
    TagProvider.getTags().then(tags => {
      setTags(tags);
    });
  }, []);

  const reset = useCallback(() => {
    setMode("create");
    setCurrentTag(null);
    setIcon(null);
    setLabel(null);
    setValue(null);
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
        <Col xs={24} sm={24} md={9}>
          <Card title={isCreateMode ? "添加标签" : "管理标签"} bordered={true}>
            <Form.Item style={{ textAlign: "center" }}>
              <div onClick={() => setVisible(true)}>
                <Avatar style={{ cursor: "pointer" }} size={32} src={icon} />
              </div>
            </Form.Item>
            <Form.Item>
              <Input
                value={label}
                placeholder={"输入标签名称"}
                onChange={e => {
                  setLabel(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <Form.Item>
              <Input
                value={value}
                placeholder={"输入标签值（请输入英文，作为路由使用）"}
                onChange={e => {
                  setValue(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <FileSelectDrawer
              visible={visible}
              onChange={icon => setIcon(icon)}
              onClose={() => setVisible(false)}
            />
            <div
              className={cls(style.btns, isCreateMode ? false : style.isEdit)}
            >
              {isCreateMode ? (
                <Button
                  type="primary"
                  onClick={() => addTag({ label, value, icon })}
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
                          label,
                          value,
                          icon
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
        <Col xs={24} sm={24} md={15}>
          <Card title="所有标签" bordered={true}>
            <List
              grid={{
                gutter: 16,
                sm: 3,
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
                      setLabel(tag.label);
                      setValue(tag.value);
                      setIcon(tag.icon);
                    }}
                  >
                    <span>
                      {tag.icon && (
                        <span className={style.icon}>
                          <img src={tag.icon} alt={tag.label} />
                        </span>
                      )}
                      <span>{tag.label}</span>
                    </span>
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
