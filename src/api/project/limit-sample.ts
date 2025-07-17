import { http } from "@/utils/http";
import type { ListQuery, ListResult, Result, KvType } from "@/utils/models";
import type { LimitSample } from "@/modules";

class LimitSampleService {
  private readonly baseUrl = "/api/LimitSample";

  async getList(data: ListQuery): Promise<ListResult<LimitSample>> {
    return http.get<ListQuery, ListResult<LimitSample>>(`${this.baseUrl}`, {
      params: data
    });
  }

  async get(id: number): Promise<Result<LimitSample>> {
    return http.get<number, Result<LimitSample>>(`${this.baseUrl}/${id}`);
  }

  async add(data: LimitSample): Promise<ListResult<LimitSample>> {
    return http.post<KvType, ListResult<LimitSample>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: LimitSample): Promise<ListResult<LimitSample>> {
    return http.put<KvType, ListResult<LimitSample>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }
}

export default new LimitSampleService();
