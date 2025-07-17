import type { ResourceBase } from "@/utils/models";
import type { Project } from "../project/project-model";

export interface Location extends ResourceBase {
  /** 位置名称 */
  name?: string;

  /** 位置描述 */
  description?: string;

  /** 关联项目ID */
  projectId?: number;

  /** 关联项目对象 */
  project?: Project;
}
