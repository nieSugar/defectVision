import type { ResourceBase } from "@/utils/models";
import type { Project } from "./project-model";

export interface Flaw extends ResourceBase {
  /** 缺陷名称 */
  name?: string;

  /** 缺陷描述 */
  description?: string;

  /** 关联项目ID */
  projectId?: number;

  /** 关联项目 */
  project?: Project;
}
