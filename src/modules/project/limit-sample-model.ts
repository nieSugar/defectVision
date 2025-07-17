import type { ResourceBase } from "@/utils/models";
import type { Project } from "./project-model";
import type { Flaw } from "./flaw-model";

/** 限度样 - 前端使用的完整模型，与后端API保持一致 */
export interface LimitSample extends ResourceBase {
  /** 项目ID */
  projectId?: number;

  /** 缺陷ID */
  flawId?: number;

  /** 位置（字符串） */
  location?: string;

  /** 图片地址（字符串） */
  imageAddress?: string;

  /** 备注 */
  remark?: Record<string, string>;

  /** 版本号 */
  versionNo?: string;

  /** 关联的项目对象 */
  project?: Project;

  /** 关联的缺陷对象 */
  flaw?: Flaw;
}

/** 后端API期望的限度样修改数据结构 */
export interface LimitSampleItem extends ResourceBase {
  /** 项目ID */
  projectId?: number;

  /** 缺陷ID */
  flawId?: number;

  /** 位置 */
  locationId?: number;

  /** 图片地址 */
  imageAddress?: string;

  /** 备注 */
  remark?: string;
}
