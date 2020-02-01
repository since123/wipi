import { httpProvider } from "./http";

export class UserProvider {
  /**
   * 用户登录
   * @param data
   */
  static async login(data) {
    return httpProvider.post("/user/login", data);
  }
}
