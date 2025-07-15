import type { ResourceBase } from "@/utils/models";

export interface Project extends ResourceBase {
  /** 项目名称 */
  name?: string;

  /** 项目描述 */
  description?: string;

  /** 3D模型文件路径 */
  url_3D?: string;

  /** 项目图片列表 */
  images?: string[];
}
