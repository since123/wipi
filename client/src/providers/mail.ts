import { httpProvider } from "./http";

export class MailProvider {
  /**
   * 获取所有邮件
   */
  static async getMails(): Promise<IMail[]> {
    return httpProvider.get("/smtp");
  }

  static async deleteMail(id): Promise<IMail> {
    return httpProvider.delete("/smtp/" + id);
  }
}
