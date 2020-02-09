import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cls from "classnames";
import style from "./index.module.scss";

export const _Header = ({ setting, menus }) => {
  const router = useRouter();
  const asPath = router.asPath;
  const pathname = router.pathname;
  const [visible, setVisible] = useState(false);

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
                <Link href={menu.path} prefetch={false}>
                  <a>{menu.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export const Header = React.memo(_Header);
