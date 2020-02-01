import React, { useCallback } from "react";
import { Form, Modal, Button, Input, Icon } from "antd";
import { FormComponentProps } from "antd/es/form";
import { UserProvider } from "@providers/user";

interface ILoginProps extends FormComponentProps {
  visible: boolean;
  onLogin: (arg: any) => void;
  onClose: () => void;
}

const _Login: React.FC<ILoginProps> = ({ form, visible, onLogin, onClose }) => {
  const { getFieldDecorator } = form;

  const submit = useCallback(e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        UserProvider.login(values).then(userInfo => {
          onLogin(userInfo);
        });
      }
    });
  }, []);

  return (
    <Modal title={"登录"} visible={visible} onCancel={onClose} footer={null}>
      <Form onSubmit={submit}>
        <Form.Item label={"用户名"}>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入用户名！" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="请输入用户名"
            />
          )}
        </Form.Item>
        <Form.Item label={"密码"}>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码！" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="请输入密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const Login = Form.create<ILoginProps>({ name: "login" })(_Login);
