import React from "react";
import { BackTop } from "antd";
import { Helmet } from "react-helmet";

import { useSetting } from "@/hooks/useSetting";
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
  const setting = useSetting();

  return (
    <div>
      <Helmet>
        <title>{setting.systemTitle}</title>
        <meta name="keyword" content={setting.seoKeyword} />
        <meta name="description" content={setting.seoDesc} />
        <link rel="shortcut icon" href={setting.systemFavicon} />
        <link
          href="//fonts.googleapis.com/css?family=Nunito:400,400i,700,700i&amp;display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
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
