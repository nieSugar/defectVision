import { http } from "@/utils/http";
import type { ListQuery, ListResult, Result, KvType } from "@/utils/models";
import type { LimitSample, LimitSampleItem } from "@/modules";

class LimitSampleService {
  private readonly baseUrl = "/api/LimitSample";

  private readonly LimitSampleVersionUrl = "/api/LimitSampleVersion";

  async getList(data: ListQuery): Promise<ListResult<LimitSample>> {
    return http.get<ListQuery, ListResult<LimitSample>>(
      `${this.LimitSampleVersionUrl}`,
      {
        params: data
      }
    );
  }

  async getListByVerionId(id: number) {
    return http.get<number, ListResult<LimitSampleItem>>(
      `${this.baseUrl}/getList`,
      {
        params: {
          limitSampleVersionId: id
        }
      }
    );
  }

  async get(id: number): Promise<Result<LimitSample>> {
    return http.get<number, Result<LimitSample>>(`${this.baseUrl}/${id}`);
  }

  /** 添加限度样 - 使用后端期望的数据结构 */
  async add(data: Array<LimitSampleItem>): Promise<Result<number>> {
    return http.post<KvType, Result<number>>(`${this.baseUrl}`, {
      data
    });
  }

  /** 修改限度样 - 使用后端期望的数据结构 */
  async update(data: LimitSampleItem): Promise<Result<LimitSample>> {
    return http.put<KvType, Result<LimitSample>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }

  async deleteByVersionId(id: number): Promise<boolean> {
    return http.delete(`${this.LimitSampleVersionUrl}`, id);
  }
}

export default new LimitSampleService();
