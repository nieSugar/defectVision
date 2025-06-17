import type { PortalSystem } from "@/modules";
import { http } from "@/utils/http";
import type { KvType, ListQuery, ListResult, Result } from "@/utils/models";

class PortalSystemService {
  private readonly baseUrl = "/api/PortalSystem";

  async getList(data: ListQuery): Promise<ListResult<PortalSystem>> {
    return http.get<ListQuery, ListResult<PortalSystem>>(`${this.baseUrl}`, {
      params: data
    });
  }

  async get(id: number): Promise<Result<PortalSystem>> {
    return http.get<number, Result<PortalSystem>>(`${this.baseUrl}/${id}`);
  }

  async add(data: PortalSystem) {
    return http.post<KvType, ListResult<PortalSystem>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: PortalSystem) {
    return http.put<KvType, ListResult<PortalSystem>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }
}

export default new PortalSystemService();
