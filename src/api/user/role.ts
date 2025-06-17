import type { Menu, Role } from "@/modules";
import { http } from "@/utils/http";
import type { Result, KvType, ListResult, ListQuery } from "@/utils/models";

class RoleService {
  private readonly baseUrl = "/api/role";

  async get(id: number): Promise<Result<Role>> {
    return http.get(`${this.baseUrl}/${id}`);
  }

  async getList(data: ListQuery): Promise<ListResult<Role>> {
    return http.get<ListQuery, ListResult<Role>>(this.baseUrl, {
      params: data.query
    });
  }

  async add(data: Role): Promise<ListResult<Role>> {
    return http.post<KvType, ListResult<Role>>(`${this.baseUrl}`, {
      data
    });
  }

  async update(data: Role): Promise<ListResult<Role>> {
    return http.put<KvType, ListResult<Role>>(`${this.baseUrl}`, data);
  }

  async delete(id: number): Promise<boolean> {
    return http.delete(`${this.baseUrl}`, id);
  }

  async changeStatus(id: number, status: boolean): Promise<boolean> {
    return http.put(`${this.baseUrl}/changeStatus`, {
      id,
      status
    });
  }
  async getRoleMenus(
    ids: Array<number>
  ): Promise<{ success: boolean; data: Array<Menu> }> {
    return http.get<KvType, ListResult<Menu>>(`${this.baseUrl}/getRoleMenus`, {
      params: { ids }
    });
  }

  async assignPermissions(
    id: number,
    menuIds: Array<number>
  ): Promise<boolean> {
    return http.post(`${this.baseUrl}/${id}/AssignPermissions`, {
      data: menuIds
    });
  }
}

export default new RoleService();
