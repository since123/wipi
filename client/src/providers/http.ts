import axios from "axios";
import { message } from "antd";

export const httpProvider = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 5000
});

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
    if (err.response.status == 504 || err.response.status == 404) {
      message.error("服务器被吃了⊙﹏⊙∥");
    } else if (err.response.status == 403) {
      message.error("权限不足,请联系管理员!");
    } else {
      message.error(
        (err.response && err.response.data && err.response.data.msg) ||
          "未知错误!"
      );
    }
    return Promise.reject(err);
  }
);
