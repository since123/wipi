import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cls from "classnames";
import { Row, Col, Button } from "antd";
import { PageProvider } from "@providers/page";
import { Login } from "../Login";
import style from "./index.module.scss";

const defaultMenus = [
  {
    label: "首页",
    path: "/"
  },

  {
    label: "归档",
    path: "/archives"
  }
];

export const Header = ({ setting }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const [visible, setVisible] = useState(false);
  const [menus, setMenus] = useState<any>(defaultMenus);

  useEffect(() => {
    PageProvider.getAllPublisedPages().then(res => {
      setMenus([
        ...defaultMenus,
        ...res.map(r => ({ path: `/page/` + r.path, label: r.name }))
      ]);
    });
  }, []);

  return (
    <header>
      <div className={style.wrapper}>
        <Row>
          <Col md={3}>
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
          <Col md={16}>
            <nav>
              <ul>
                {menus.map(menu => (
                  <li
                    key={menu.label}
                    className={cls({
                      [style.active]: pathname === menu.path
                    })}
                  >
                    <Link href={menu.path}>
                      <a>{menu.label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Col>
          <Col md={5} xs={0}>
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
