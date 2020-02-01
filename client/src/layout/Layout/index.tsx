import React from "react";
import { BackTop } from "antd";
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
  return (
    <div>
      <Header />
      <main
        style={{
          backgroundColor
        }}
      >
        <div className={style.wrapper}>{children}</div>
      </main>
      <BackTop />
      <Footer />
    </div>
  );
};
