import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Dropdown, Avatar } from "antd";

export const UserInfo = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    let info = window.sessionStorage.getItem("userInfo");
    try {
      info = JSON.parse(info);
      setUser(info as any);
    } catch (e) {}
  }, []);

  const menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <Link href="/admin/ownspace">
            <a>个人中心</a>
          </Link>
        </Menu.Item>

        <Menu.Item>
          <Link href="/admin">
            <a>退出</a>
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
        <Avatar
          style={{ backgroundColor: "#87d068" }}
          size={"small"}
          icon="user"
        />
        {user ? <span style={{ marginLeft: 8 }}>Hi, {user.name}</span> : null}
      </div>
    </Dropdown>
  );
};
