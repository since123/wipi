import React, { useState, useCallback, useEffect, useMemo } from "react";
import { NextPage } from "next";
import {
  Row,
  Col,
  Table,
  Select,
  Badge,
  Button,
  Form,
  Popconfirm,
  message
} from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { ViewProvider } from "@/providers/view";
import style from "./index.module.scss";

const Views: NextPage = () => {
  const [views, setViews] = useState<IView[]>([]);
  const [url, setURL] = useState(null);

  // 获取评论
  const getViews = useCallback(() => {
    ViewProvider.getViews().then(res => {
      setViews(res);
    });
  }, []);

  const [uvs, totalUV] = useMemo(() => {
    let total = views.length;
    let uvs = views.reduce((a, c) => {
      if (!a[c.url]) {
        a[c.url] = 0;
      }

      a[c.url] += 1;
      return a;
    }, {});
    return [uvs, total];
  }, [views]);
  const [pvs, totalPV] = useMemo(() => {
    let total = 0;
    let pvs = views.reduce((a, c) => {
      if (!a[c.url]) {
        a[c.url] = 0;
      }
      total += c.count;
      a[c.url] += c.count;
      return a;
    }, {});
    return [pvs, total];
  }, [views]);

  useEffect(() => {
    getViews();
  }, []);

  // 删除评论
  const deleteView = useCallback(id => {
    ViewProvider.deleteView(id).then(() => {
      message.success("评论删除成功");
      getViews();
    });
  }, []);

  const columns = [
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      width: "10%"
    },
    {
      title: "User Agent",
      dataIndex: "userAgent",
      key: "userAgent",
      width: "30%"
    },
    {
      title: "联系方式",
      dataIndex: "url",
      key: "url",
      width: "20%"
    },
    {
      title: "访问量",
      dataIndex: "count",
      key: "count",
      render: views => (
        <Badge
          count={views}
          showZero={true}
          overflowCount={999}
          style={{ backgroundColor: "#52c41a" }}
        />
      )
    },
    {
      title: "访问时间",
      dataIndex: "createAt",
      key: "createAt",
      render: date => dayjs.default(date).format("YYYY-MM-DD HH:mm:ss")
    }
  ];

  const actionColumn = {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <span>
        <Popconfirm
          title="确认删除这个访问？"
          onConfirm={() => deleteView(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>
      </span>
    )
  };

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <Row style={{ marginBottom: 16 }}>
          <Col sm={20}>
            <Select
              style={{ width: 240 }}
              placeholder="查看指定页面统计"
              onChange={setURL}
              {...(url ? { value: url } : {})}
            >
              {Object.keys(pvs).map(url => {
                return (
                  <Select.Option key={url} value={url}>
                    {url}
                  </Select.Option>
                );
              })}
            </Select>
            {url && (
              <span style={{ marginLeft: 16 }}>
                <span>uv: {uvs[url]}</span>
                {" , "}
                <span>pv: {pvs[url]}</span>
              </span>
            )}
          </Col>
          <Col sm={4} style={{ textAlign: "right" }}>
            <Button onClick={getViews} icon="reload">
              刷新
            </Button>
          </Col>
        </Row>
        <Table
          columns={[...columns, actionColumn]}
          dataSource={views}
          rowKey={"id"}
          footer={() => (
            <Form layout="inline">
              <Form.Item label={"UV"}>
                <Badge
                  count={totalUV}
                  showZero={true}
                  style={{ backgroundColor: "#f50" }}
                />
              </Form.Item>
              <Form.Item label={"PV"}>
                <Badge
                  count={totalPV}
                  showZero={true}
                  style={{ backgroundColor: "#2db7f5" }}
                />
              </Form.Item>
            </Form>
          )}
        />
      </div>
    </AdminLayout>
  );
};

export default Views;
