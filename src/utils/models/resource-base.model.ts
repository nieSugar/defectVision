export interface ResourceBase {
  id?: number;

  /** 是否删除 */
  isDeleted?: boolean;

  /** 创建时间 */
  createTime?: string;

  /** 修改时间 */
  modifyTime?: string;
}
