import React, { useCallback } from "react";
import { Form, Modal, Button, Input, Icon } from "antd";
import Router from "next/router";
import { FormComponentProps } from "antd/es/form";
import { UserProvider } from "@providers/user";
import { AdminLayout } from "@/layout/AdminLayout";
import style from "./index.module.scss";

interface ILoginProps extends FormComponentProps {}

const _Login: React.FC<ILoginProps> = ({ form }) => {
  const { getFieldDecorator } = form;

  const submit = useCallback(e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        UserProvider.login(values).then(userInfo => {
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          sessionStorage.setItem("token", userInfo.token);
          Router.push("/admin");
        });
      }
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <h2>系统登录</h2>
        <Form onSubmit={submit}>
          <Form.Item>
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入用户名！" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                size="large"
                placeholder="请输入用户名"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码！" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                size="large"
                placeholder="请输入密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Form.create<ILoginProps>({ name: "login" })(_Login);
