import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cls from "classnames";
import { Row, Col, Button } from "antd";
import { useMenus } from "@/hooks/useMenus";
import { Login } from "../Login";
import style from "./index.module.scss";

export const Header = ({ setting }) => {
  const router = useRouter();
  const asPath = router.asPath;
  const pathname = router.pathname;
  const [visible, setVisible] = useState(false);
  const menus = useMenus();

  return (
    <header>
      <div className={style.wrapper}>
        <div className={style.logo}>
          {/^http/.test(setting.systemLogo) ? (
            <Link href="/">
              <a>
                <img src={setting.systemLogo} alt="" />
              </a>
            </Link>
          ) : (
            <Link href="/">
              <a dangerouslySetInnerHTML={{ __html: setting.systemLogo }}></a>
            </Link>
          )}
        </div>

        <div
          className={cls(style.mobileTrigger, visible ? style.active : false)}
          onClick={() => setVisible(!visible)}
        >
          <div className={style.stick}></div>
          <div className={style.stick}></div>
          <div className={style.stick}></div>
        </div>

        <nav className={cls(visible ? style.active : false)}>
          <ul>
            {menus.map(menu => (
              <li
                key={menu.label}
                className={cls({
                  [style.active]: pathname === menu.path || asPath === menu.path
                })}
              >
                <Link href={menu.path}>
                  <a>{menu.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* <Row> */}
        {/* <Col md={3}></Col> */}
        {/* <Col md={21}> */}

        {/* </Col> */}
        {/* <Col md={5} xs={0}>
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
          </Col> */}
        {/* </Row> */}
      </div>
    </header>
  );
};
