import type { Dept } from "@/modules";
import { http } from "@/utils/http";
import type {
  Result,
  GetResultList,
  KvType,
  ListResult,
  ListQuery
} from "@/utils/models";

class DeptService {
  private readonly baseUrl = "/api/dept";

  async get(id: number): Promise<Result<Dept>> {
    return http.get(`${this.baseUrl}/${id}`);
  }

  async getList(data?: ListQuery): Promise<GetResultList<Dept>> {
    return http.get<KvType, GetResultList<Dept>>(
      `${this.baseUrl}/findListByNameAndStatus`,
      {
        params: data?.query
      }
    );
  }

  async add(data: Dept) {
    return http.post<KvType, ListResult<Dept>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: Dept) {
    return http.put<KvType, ListResult<Dept>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }
}

export default new DeptService();
