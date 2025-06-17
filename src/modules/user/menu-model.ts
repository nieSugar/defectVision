import type { ResourceBase } from "@/utils/models";

export interface Menu extends ResourceBase {
  /** 菜单名称 */
  name?: string;

  /** 菜单权限标识 */
  perms?: string;

  /** 菜单排序 */
  rank?: number;

  /** 父菜单id */
  parentId?: number;

  /** BG ID */
  bgid?: number;

  children?: Array<Menu>;
  hasChildren?: boolean;
}
