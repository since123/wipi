import { httpProvider } from "./http";

export class ArticleProvider {
  /**
   * 获取所有文章
   */
  static async getArticles(needFilter = false): Promise<IArticle[]> {
    return httpProvider.get(
      "/article",
      needFilter
        ? {
            params: { status: "publish" }
          }
        : {}
    );
  }

  /**
   * 获取所有文章归档
   */
  static async getArchives(): Promise<{ [key: string]: IArticle[] }> {
    return httpProvider.get("/article/archives");
  }

  /**
   * 获取指定文章
   * @param id
   */
  static async getArticle(id, needFilter = false): Promise<IArticle> {
    return httpProvider.get(
      `/article/${id}`,
      needFilter
        ? {
            params: { status: "publish" }
          }
        : {}
    );
  }

  /**
   * 新建文章
   * @param data
   */
  static async addArticle(data): Promise<IArticle> {
    return httpProvider.post("/article", data);
  }

  /**
   * 更新文章
   * @param id
   * @param data
   */
  static async updateArticle(id, data): Promise<IArticle> {
    return httpProvider.patch(`/article/${id}`, data);
  }

  /**
   * 更新文章阅读量
   * @param id
   * @param data
   */
  static async updateArticleViews(id): Promise<IArticle> {
    return httpProvider.post(`/article/${id}/views`);
  }

  /**
   * 校验文章密码是否正确
   * @param id
   * @param password
   */
  static async checkPassword(id, password): Promise<{ pass: boolean }> {
    return httpProvider.post(`/article/${id}/checkPassword`, { password });
  }

  /**
   * 删除文章
   * @param id
   */
  static async deleteArticle(id): Promise<IArticle> {
    return httpProvider.delete(`/article/${id}`);
  }
}
