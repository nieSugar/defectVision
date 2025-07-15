import { http } from "@/utils/http";
import type { ListResult } from "@/utils/models";
import type { FileInfo } from "@/modules";

class FileService {
  private baseUrl = "/api/file";

  /**
   * 上传文件 - POST /api/file/InsertFile
   * @param file 单个文件或文件数组
   */
  async upload(file: File | File[]): Promise<FileInfo[]> {
    const formData = new FormData();

    if (!Array.isArray(file)) {
      formData.append("File", file);
    } else {
      file.forEach(f => {
        formData.append("File", f);
      });
    }

    const result = await http.post<FormData, ListResult<FileInfo>>(
      `${this.baseUrl}/InsertFile`,
      {
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (result && result.data && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.error("文件上传API响应格式不正确:", result);
      throw new Error("文件上传失败：响应格式不正确");
    }
  }
}

// 保持向后兼容的OSS服务
class OSSService {
  private baseUrl = "/api/file";
  private previewUrl = `${this.baseUrl}/InsertFile`;

  async upload(file: File | File[]) {
    const formData = new FormData();

    if (!Array.isArray(file)) {
      formData.append("File", file);
    } else {
      file.forEach(f => {
        formData.append("File", f);
      });
    }

    const result = await http.post<FormData, ListResult<FileInfo>>(
      this.previewUrl,
      {
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (result && result.data && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.error("文件上传API响应格式不正确:", result);
      throw new Error("文件上传失败：响应格式不正确");
    }
  }
}

// 导出文件服务实例
export const fileService = new FileService();

// 保持向后兼容，导出原有的OSS服务
export default new OSSService();
