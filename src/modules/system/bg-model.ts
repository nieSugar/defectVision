import type { ResourceBase } from "@/utils/models";

export interface BGManager extends ResourceBase {
  name?: string;

  code?: string;

  /** 创建时间 */
  createTime?: string;

  /** 更新时间 */
  updateTime?: string;

  /** 备注 */
  describe?: string;
}
