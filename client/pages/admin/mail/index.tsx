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
  Modal,
  Popconfirm,
  message
} from "antd";
import * as dayjs from "dayjs";
import { AdminLayout } from "@/layout/AdminLayout";
import { MailProvider } from "@/providers/mail";
import style from "./index.module.scss";

const Mail: NextPage = () => {
  const [mails, setMails] = useState<IMail[]>([]);
  const [selectedMail, setSelectedMail] = useState(null);

  // 获取邮件
  const getMails = useCallback(() => {
    MailProvider.getMails().then(res => {
      setMails(res);
    });
  }, []);

  useEffect(() => {
    getMails();
  }, []);

  // 删除评论
  const deleteView = useCallback(id => {
    MailProvider.deleteMail(id).then(() => {
      message.success("邮件删除成功");
      getMails();
    });
  }, []);

  const columns = [
    {
      title: "发件人",
      dataIndex: "from",
      key: "from"
    },
    {
      title: "收件人",
      dataIndex: "to",
      key: "to"
    },
    {
      title: "主题",
      dataIndex: "subject",
      key: "subject"
    },
    {
      title: "内容",
      dataIndex: "html",
      key: "html",
      render: (_, record) => (
        <Button
          type="link"
          style={{ paddingLeft: 0 }}
          onClick={() => {
            setSelectedMail(record);
          }}
        >
          点击查看
        </Button>
      )
    },
    {
      title: "发送时间",
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
          title="确认删除这个邮件？"
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
          <Col sm={24} style={{ textAlign: "right" }}>
            <Button onClick={getMails} icon="reload">
              刷新
            </Button>
          </Col>
        </Row>
        <Table
          columns={[...columns, actionColumn]}
          dataSource={mails}
          rowKey={"id"}
        />
        <Modal
          title={"发送内容"}
          visible={selectedMail}
          footer={null}
          onCancel={() => {
            setSelectedMail(null);
          }}
        >
          <div
            className="markdown"
            dangerouslySetInnerHTML={{
              __html: selectedMail && selectedMail.html
            }}
          ></div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Mail;
