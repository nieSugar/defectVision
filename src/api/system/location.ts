import { http } from "@/utils/http";
import type {
  ListQuery,
  ListResult,
  Result,
  GetResultList
} from "@/utils/models";
import type { Location } from "@/modules";

class LocationService {
  private readonly baseUrl = "/api/Location";

  /**
   * 分页获取位置列表
   */
  async getList(data: ListQuery): Promise<ListResult<Location>> {
    return http.get<ListQuery, ListResult<Location>>(`${this.baseUrl}`, {
      params: data
    });
  }

  /**
   * 获取位置集合数据（不分页）
   */
  async getAllList(): Promise<GetResultList<Location>> {
    return http.get(`${this.baseUrl}/GetList`);
  }

  /**
   * 获取位置详情
   */
  async get(id: number): Promise<Result<Location>> {
    return http.get<number, Result<Location>>(`${this.baseUrl}/${id}`);
  }

  /**
   * 添加位置
   */
  async add(data: Location): Promise<Result<Location>> {
    return http.post<Location, Result<Location>>(`${this.baseUrl}`, { data });
  }

  /**
   * 修改位置
   */
  async update(data: Location): Promise<Result<Location>> {
    return http.put<Location, Result<Location>>(`${this.baseUrl}`, data);
  }

  /**
   * 删除位置
   */
  async delete(id: number): Promise<Result<boolean>> {
    return http.delete(`${this.baseUrl}`, id);
  }
}

export default new LocationService();
