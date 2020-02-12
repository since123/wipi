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
  const [loading, setLoaidng] = useState(false);
  const [urls, setURLs] = useState([]);
  const [url, setURL] = useState(null);

  const getViews = useCallback(() => {
    if (loading) {
      return;
    }

    setLoaidng(true);
    ViewProvider.getViews()
      .then(res => {
        setViews(res);
        setURLs(Array.from(new Set(res.map(r => r.url))));
        setLoaidng(false);
      })
      .catch(() => setLoaidng(false));
  }, []);

  const getViewsByUrl = useCallback(url => {
    if (!url || loading) {
      return;
    }

    setLoaidng(true);
    ViewProvider.getViewsByUrl(url)
      .then(res => {
        setViews(res);

        setLoaidng(false);
      })
      .catch(() => setLoaidng(false));
  }, []);

  // 删除评论
  const deleteView = useCallback(id => {
    ViewProvider.deleteView(id).then(() => {
      message.success("访问删除成功");
      url ? getViewsByUrl(url) : getViews();
    });
  }, []);

  useEffect(() => {
    getViews();
  }, []);

  useEffect(() => {
    getViewsByUrl(url);
  }, [url]);

  const uvs = useMemo(() => {
    return Array.from(new Set(views.map(view => view.userAgent))).length;
  }, [views]);
  const pvs = useMemo(() => {
    return views.length;
  }, [views]);

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
      title: "URL",
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
      <span className={style.action}>
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

  const VPV = () => {
    return (
      <Form layout="inline">
        <Form.Item label={"UV"}>
          <Badge
            count={uvs}
            showZero={true}
            overflowCount={Infinity}
            style={{ backgroundColor: "#f50" }}
          />
        </Form.Item>
        <Form.Item label={"PV"}>
          <Badge
            count={pvs}
            showZero={true}
            overflowCount={Infinity}
            style={{ backgroundColor: "#2db7f5" }}
          />
        </Form.Item>
      </Form>
    );
  };

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} sm={18}>
            <Select
              style={{ width: "100%" }}
              placeholder="查看指定页面统计"
              onChange={setURL}
              {...(url ? { value: url } : {})}
            >
              {urls.map(url => {
                return (
                  <Select.Option key={url} value={url}>
                    {url}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col xs={24} sm={6} className={style.btns}>
            <Button.Group>
              <Button
                loading={loading}
                icon="reload"
                onClick={() => {
                  url ? getViewsByUrl(url) : getViews();
                }}
              >
                刷新
              </Button>
              <Button
                icon="rollback"
                onClick={() => {
                  setURL(null);
                  getViews();
                }}
                disabled={loading}
              >
                重置
              </Button>
            </Button.Group>
          </Col>
        </Row>
        <div className={style.upv}>
          <VPV />
        </div>
        <Table
          columns={[...columns, actionColumn]}
          dataSource={views}
          rowKey={"id"}
          footer={() => <VPV />}
        />
      </div>
    </AdminLayout>
  );
};

export default Views;
