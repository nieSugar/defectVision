import { http } from "@/utils/http";
import type { ListQuery, ListResult, Result, KvType } from "@/utils/models";
import type { Flaw } from "@/modules";

class FlawService {
  private readonly baseUrl = "/api/Flaw";

  async getList(data: ListQuery): Promise<ListResult<Flaw>> {
    return http.get<ListQuery, ListResult<Flaw>>(`${this.baseUrl}`, {
      params: data
    });
  }

  async get(id: number): Promise<Result<Flaw>> {
    return http.get<number, Result<Flaw>>(`${this.baseUrl}/${id}`);
  }

  async add(data: Flaw): Promise<ListResult<Flaw>> {
    return http.post<KvType, ListResult<Flaw>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: Flaw): Promise<ListResult<Flaw>> {
    return http.put<KvType, ListResult<Flaw>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }

  async getByProject(projectId: number): Promise<ListResult<Flaw>> {
    return http.get<number, ListResult<Flaw>>(
      `${this.baseUrl}/project/${projectId}`
    );
  }
}

export default new FlawService();
