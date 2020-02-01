import React, { useEffect, useState } from "react";
import { SettingProvider } from "@providers/setting";
import style from "./index.module.scss";

export const Footer = () => {
  const [setting, setSetting] = useState<any>({});

  useEffect(() => {
    SettingProvider.getSetting().then(res => {
      setSetting(res);
    });
  }, []);

  return setting && setting.systemFooterInfo ? (
    <footer>
      <div
        className={style.wrapper}
        dangerouslySetInnerHTML={{
          __html: setting.systemFooterInfo
        }}
      ></div>
    </footer>
  ) : null;
};
