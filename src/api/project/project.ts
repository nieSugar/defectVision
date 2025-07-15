import { http } from "@/utils/http";
import type { ListQuery, ListResult, Result, KvType } from "@/utils/models";
import type { Project } from "@/modules";

class ProjectService {
  private readonly baseUrl = "/api/project";

  async getList(data: ListQuery): Promise<ListResult<Project>> {
    return http.get<ListQuery, ListResult<Project>>(`${this.baseUrl}`, {
      params: data
    });
  }

  async get(id: number): Promise<Result<Project>> {
    return http.get<number, Result<Project>>(`${this.baseUrl}/${id}`);
  }

  async add(data: Project): Promise<ListResult<Project>> {
    return http.post<KvType, ListResult<Project>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: Project): Promise<ListResult<Project>> {
    return http.put<KvType, ListResult<Project>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }
}

export default new ProjectService();
