import { httpProvider } from "./http";

export class ArticleProvider {
  /**
   * 获取所有文章
   */
  static async getArticles(): Promise<IArticle[]> {
    return httpProvider.get("/article");
  }

  /**
   * 获取指定文章
   * @param id
   */
  static async getArticle(id): Promise<IArticle> {
    return httpProvider.get(`/article/${id}`);
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
