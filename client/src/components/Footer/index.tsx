import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { RecentArticles } from "@components/RecentArticles";
import { Tags } from "@components/Tags";
import style from "./index.module.scss";

export const Footer = ({ setting }) => {
  return (
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
      {setting && setting.systemFooterInfo && (
        <div
          className={style.copyright}
          dangerouslySetInnerHTML={{
            __html: setting.systemFooterInfo
          }}
        ></div>
      )}
    </footer>
  );
};
