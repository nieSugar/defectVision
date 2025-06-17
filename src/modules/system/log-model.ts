import type { ResourceBase } from "@/utils/models";

export interface Log extends ResourceBase {
  /** 操作模块名称 */
  titile: string;

  /** 操作类型 */
  type: number; // 1:新增 2:修改 3:删除 4:其他

  /** 操作人 */
  operName: string;

  /** 操作状态 */
  status: number; // 1:成功 2:失败

  /** 请求方式 */
  requestMethod: string; // GET POST PUT DELETE
}
