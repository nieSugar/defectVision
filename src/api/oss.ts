import { http } from "@/utils/http";
import type { Result } from "@/utils/models";

interface FileUploadResult {
  filePath: string;
  fileSize: number;
}

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

    const result = await http.post<FormData, Result<FileUploadResult[]>>(
      this.previewUrl,
      {
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return result.data;
  }
}

export default new OSSService();
