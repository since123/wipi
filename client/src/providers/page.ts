import { httpProvider } from "./http";

export class PageProvider {
  /**
   * 获取所有页面
   */
  static async getPages(): Promise<IPage[]> {
    return httpProvider.get("/page");
  }

  /**
   * 获取所有已发布页面
   */
  static async getAllPublisedPages(): Promise<IPage[]> {
    return httpProvider.get("/page", { params: { status: "publish" } });
  }

  /**
   * 获取指定页面
   * @param id
   */
  static async getPage(id): Promise<IPage> {
    return httpProvider.get(`/page/${id}`);
  }

  /**
   * 新建页面
   * @param data
   */
  static async addPage(data): Promise<IPage> {
    return httpProvider.post("/page", data);
  }

  /**
   * 更新页面
   * @param id
   * @param data
   */
  static async updatePage(id, data): Promise<IPage> {
    return httpProvider.patch(`/page/${id}`, data);
  }

  /**
   * 删除页面
   * @param id
   */
  static async deletePage(id): Promise<IPage> {
    return httpProvider.delete(`/page/${id}`);
  }
}
