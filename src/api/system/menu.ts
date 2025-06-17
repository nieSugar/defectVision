import type { Menu } from "@/modules";
import { http } from "@/utils/http";
import type {
  Result,
  GetResultList,
  KvType,
  ListQuery,
  ListResult
} from "@/utils/models";

class MenuService {
  private readonly baseUrl = "/api/menu";

  async getList(data: ListQuery): Promise<ListResult<Menu>> {
    return http.get<ListQuery, ListResult<Menu>>(`${this.baseUrl}`, {
      params: data
    });
  }

  async get(id: number): Promise<Result<Menu>> {
    return http.get<number, Result<Menu>>(`${this.baseUrl}/${id}`);
  }

  async add(data: Menu) {
    return http.post<KvType, ListResult<Menu>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: Menu) {
    return http.put<KvType, ListResult<Menu>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }

  async getAuthMenus(): Promise<GetResultList<Menu>> {
    return http.get(`${this.baseUrl}/getAuthMenus`);
  }
}

export default new MenuService();
