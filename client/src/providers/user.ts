import { httpProvider } from "./http";

export class UserProvider {
  /**
   * 用户登录
   * @param data
   */
  static async login(data): Promise<IUser> {
    return httpProvider.post("/auth/login", data);
  }
}
