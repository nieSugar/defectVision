import type { ResourceBase } from "@/utils/models";

export interface Menu extends ResourceBase {
  /** 菜单名称 */
  name?: string;

  /** 菜单权限标识 */
  perms?: string;

  /** 菜单排序 */
  rank?: number;

  /** 菜单状态
   * 1 正常
   * 2 停用
   */
  status?: number; // 1 正常  2 停用  是否显示在菜单栏 如果为 2 则不可访问

  /** 是否在菜单栏中可见 可以访问
   * 1 显示
   * 2 隐藏
   */
  visible?: number; // 1 显示  2 隐藏 是否显示在菜单栏 可以访问

  /** 类型
   * 1 目录
   * 2 菜单
   * 3 按钮
   */
  type?: number; // 1 目录  2 菜单 3 按钮

  /** 菜单路径 */
  path?: string;

  /** 父菜单id */
  parentId?: number;

  /** 是否外链 */
  isFrame?: number; // 1 是    2 不是

  /** 是否内嵌 */
  isEmbedded?: number; // 1 是    2 不是

  /** 外链url */
  frameSrc?: string;

  /** 菜单图标 */
  icon?: string;

  /** 是否缓存 */
  isCache?: number;

  /** 菜单默认查询参数 */
  query?: string;

  /** 组件名称 */
  component?: string;

  children?: Array<Menu>;
  hasChildren?: boolean;
}
