import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { Menu, Dropdown, Avatar, message } from "antd";

export const UserInfo = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    let info = window.sessionStorage.getItem("userInfo");
    try {
      info = JSON.parse(info);
      setUser(info as any);
    } catch (e) {}

    if (!info) {
      message.error("异常登录");
      Router.replace("/");
    }
  }, []);

  const menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <Link href="/admin/ownspace">
            <a>个人中心</a>
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <Dropdown overlay={menu}>
      <div
        style={{
          display: "inline-block",
          padding: "0 12px",
          cursor: "pointer"
        }}
      >
        {user && user.avatar ? (
          <Avatar src={user.avatar} />
        ) : (
          <Avatar icon="user" />
        )}
        {user ? <span style={{ marginLeft: 8 }}>Hi, {user.name}</span> : null}
      </div>
    </Dropdown>
  );
};
