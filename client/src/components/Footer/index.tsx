import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { SettingProvider } from "@providers/setting";
import { RecentArticles } from "@components/RecentArticles";
import { Tags } from "@components/Tags";
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
      <div className={style.info}>
        <Row gutter={16}>
          <Col md={12} sm={24}>
            <div style={{ padding: "16px 32px" }}>
              <RecentArticles />
            </div>
          </Col>
          <Col md={12} sm={24}>
            <div style={{ padding: "16px 32px" }}>
              <Tags />
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={style.copyright}
        dangerouslySetInnerHTML={{
          __html: setting.systemFooterInfo
        }}
      ></div>
    </footer>
  ) : null;
};
