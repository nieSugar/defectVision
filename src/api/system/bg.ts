import { http } from "@/utils/http";
import type { BGManager } from "@/modules";
import type { ListQuery, ListResult, Result, KvType } from "@/utils/models";

class BGService {
  private readonly baseUrl = "/api/bgManager";

  async getList(data?: ListQuery): Promise<ListResult<BGManager>> {
    if (data) {
      return http.get<ListQuery, ListResult<BGManager>>(`${this.baseUrl}`, {
        params: data
      });
    } else {
      return http.get<ListQuery, ListResult<BGManager>>(
        `${this.baseUrl}/getList`
      );
    }
  }

  async get(id: number): Promise<Result<BGManager>> {
    return http.get<number, Result<BGManager>>(`${this.baseUrl}/${id}`);
  }

  async add(data: BGManager) {
    return http.post<KvType, ListResult<BGManager>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: BGManager) {
    return http.put<KvType, ListResult<BGManager>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }
}

export default new BGService();
