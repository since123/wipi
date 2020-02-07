import axios from "axios";
import { message } from "antd";
import { showLogin } from "@/layout/AdminLayout";

export const httpProvider = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "http://106.12.7.11:4000",
  timeout: 10000
});

httpProvider.interceptors.request.use(
  config => {
    if (typeof window !== "undefined") {
      const token = window.sessionStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },

  err => {
    throw new Error("发起请求出错");
  }
);

httpProvider.interceptors.response.use(
  data => {
    if (data.status && data.status == 200 && data.data.status == "error") {
      message.error({ message: data.data.msg });
      return;
    }

    const res = data.data;

    if (!res.success) {
      message.error(res.msg);
      return;
    }

    return res.data;
  },
  err => {
    if (err && err.response && err.response.status) {
      const status = err.response.status;

      switch (status) {
        case 504:
        case 404:
          message.error("服务器异常");
          break;

        case 403:
        case 401:
          {
            if (typeof window !== "undefined") {
              let href = window.location.href;

              if (/admin/.test(href)) {
                message.info("请重新登录");
                showLogin();
              }
            } else {
              message.error("权限不足!");
            }
          }
          break;

        default:
          message.error(
            (err.response && err.response.data && err.response.data.msg) ||
              "未知错误!"
          );
      }
    }

    return Promise.reject(err);
  }
);
