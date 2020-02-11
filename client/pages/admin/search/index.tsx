import React, { useState, useCallback, useEffect } from "react";
import { NextPage } from "next";
import { Row, Col, Table, Badge, Button, Popconfirm, message } from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { SearchProvider } from "@/providers/search";
import style from "./index.module.scss";

const Search: NextPage = () => {
  const [data, setData] = useState<ISearch[]>([]);
  const [loading, setLoaidng] = useState(false);

  // 获取
  const getData = useCallback(() => {
    if (loading) {
      return;
    }

    setLoaidng(true);
    SearchProvider.getRecords()
      .then(res => {
        setData(res);
        setLoaidng(false);
      })
      .catch(() => setLoaidng(false));
  }, []);

  // 删除
  const deleteItem = useCallback(id => {
    SearchProvider.deleteRecord(id).then(() => {
      message.success("搜索记录删除成功");
      getData();
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      title: "类型",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "搜索词",
      dataIndex: "keyword",
      key: "keyword"
    },
    {
      title: "搜索量",
      dataIndex: "count",
      key: "count",
      render: views => (
        <Badge
          count={views}
          showZero={true}
          overflowCount={Infinity}
          style={{ backgroundColor: "#52c41a" }}
        />
      )
    },
    {
      title: "搜索时间",
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
          title="确认删除这个搜索记录？"
          onConfirm={() => deleteItem(record.id)}
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
          <Col xs={24} span={24} className={style.btns}>
            <Button loading={loading} icon="reload" onClick={getData}>
              刷新
            </Button>
          </Col>
        </Row>

        <Table
          columns={[...columns, actionColumn]}
          dataSource={data}
          rowKey={"id"}
        />
      </div>
    </AdminLayout>
  );
};

export default Search;
