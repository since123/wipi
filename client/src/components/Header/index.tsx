import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Row, Col, Input, Button } from "antd";
import { SettingProvider } from "@providers/setting";
import { Login } from "../Login";
import style from "./index.module.scss";

const { Search } = Input;

const menus = [];

export const Header = () => {
  const [visible, setVisible] = useState(false);
  const [setting, setSetting] = useState<any>({});

  useEffect(() => {
    SettingProvider.getSetting().then(res => {
      setSetting(res);
    });
  }, []);

  return (
    <header>
      <div className={style.wrapper}>
        <Row>
          <Col md={4}>
            <div className={style.logo}>
              {/^http/.test(setting.systemLogo) ? (
                <Link href="/">
                  <a>
                    <img src={setting.systemLogo} alt="" />
                  </a>
                </Link>
              ) : (
                <Link href="/">
                  <a
                    dangerouslySetInnerHTML={{ __html: setting.systemLogo }}
                  ></a>
                </Link>
              )}
            </div>
          </Col>
          <Col md={14}>
            <nav>
              <ul>
                {menus.map(menu => (
                  <li key={menu.label}>
                    <Link href={menu.path}>
                      <a>{menu.label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* <div className={style.search}>
                <Search
                  onSearch={value => console.log(value)}
                  style={{ width: 200 }}
                />
              </div> */}
            </nav>
          </Col>
          <Col md={6}>
            <div className={style.login}>
              <Button type="link" onClick={() => setVisible(true)}>
                立即登录
              </Button>
              <Login
                visible={visible}
                onClose={() => setVisible(false)}
                onLogin={userInfo => {
                  setVisible(false);
                  window.open("/admin");
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </header>
  );
};
