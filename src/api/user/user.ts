import type { User } from "@/modules/user/user-model";
import { http } from "@/utils/http";
import type { Result, KvType, ListResult, ListQuery } from "@/utils/models";
import type { HttpStatusCode } from "axios";

export type UserResult = {
  code: HttpStatusCode;
  data: string;
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

class UserService {
  authUrl = "/api/auth";
  userUrl = "/api/user";

  /** 登录 */
  public login(data?: { name: string; password: string }) {
    return http.request<UserResult>("post", `${this.authUrl}`, { data });
  }

  public get(id: number): Promise<Result<User>> {
    return http.get(`${this.userUrl}/${id}`);
  }
  public getList(data: ListQuery): Promise<ListResult<User>> {
    return http.get<ListQuery, ListResult<User>>(`${this.userUrl}`, {
      params: data.query
    });
  }

  public add(data: User) {
    return http.post<KvType, ListResult<User>>(`${this.userUrl}`, {
      data
    });
  }

  public update(data: User) {
    return http.put<KvType, ListResult<User>>(`${this.userUrl}`, data);
  }

  public delete(id: number): Promise<boolean> {
    return http.delete(`${this.userUrl}`, id);
  }

  public changeStatus(id: number, status: boolean): Promise<boolean> {
    return http.put(`${this.userUrl}/changeStatus`, {
      id,
      status
    });
  }
}
const userService = new UserService();

export default userService;
