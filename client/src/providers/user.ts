import { httpProvider } from "./http";

export class UserProvider {
  /**
   * 用户登录
   * @param data
   */
  static async login(data): Promise<IUser> {
    return httpProvider.post("/auth/login", data);
  }

  /**
   * 更新用户信息
   * @param data
   */
  static async update(data): Promise<IUser> {
    return httpProvider.post("/user/update", data);
  }

  /**
   * 更新用户密码
   * @param data
   */
  static async updatePassword(data): Promise<IUser> {
    return httpProvider.post("/user/password", data);
  }
}
