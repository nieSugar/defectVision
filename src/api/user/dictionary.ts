import type { Dictionary } from "@/modules";
import { http } from "@/utils/http";
import type {
  Result,
  GetResultList,
  KvType,
  ListResult,
  ListQuery
} from "@/utils/models";

class DictionaryService {
  private readonly baseUrl = "/api/sysdic";

  async get(id: number): Promise<Result<Dictionary>> {
    return http.get(`${this.baseUrl}/${id}`);
  }

  async getList(data?: ListQuery): Promise<GetResultList<Dictionary>> {
    return http.get<KvType, GetResultList<Dictionary>>(
      `${this.baseUrl}/getList`,
      {
        params: data?.query
      }
    );
  }

  async add(data: Dictionary) {
    return http.post<KvType, ListResult<Dictionary>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: Dictionary) {
    return http.put<KvType, ListResult<Dictionary>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }
}

export default new DictionaryService();
