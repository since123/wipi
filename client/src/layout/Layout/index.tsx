import React, { useState, useEffect } from "react";
import { BackTop } from "antd";
import { SettingProvider } from "@providers/setting";

import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import style from "./index.module.scss";

interface Iprops {
  backgroundColor?: string;
}

export const Layout: React.FC<Iprops> = ({
  backgroundColor = "#f4f5f5",
  children
}) => {
  const [setting, setSetting] = useState<any>({});

  useEffect(() => {
    SettingProvider.getSetting().then(res => {
      setSetting(res);
    });
  }, []);

  return (
    <div>
      <Header setting={setting} />
      <main
        style={{
          backgroundColor
        }}
      >
        <div className={style.wrapper}>{children}</div>
      </main>
      <BackTop />
      <Footer setting={setting} />
    </div>
  );
};
