import { httpProvider } from "./http";

export class FileProvider {
  /**
   * 上传文件
   * @param file
   */
  static async uploadFile(file): Promise<IFile> {
    const formData = new FormData();
    formData.append("file", file);

    return httpProvider.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  /**
   * 获取指定文件
   */
  static async getFiles(): Promise<IFile[]> {
    return httpProvider.get("/file");
  }

  /**
   * 删除文件
   * @param id
   */
  static async deleteFile(id): Promise<IFile> {
    return httpProvider.delete(`/file/${id}`);
  }
}
