import type { ResourceBase } from "@/utils/models";
import type { Project } from "./project-model";

export interface LimitSample extends ResourceBase {
  /** 限度样名称 */
  name?: string;

  /** 限度样描述 */
  description?: string;

  /** 项目ID */
  projectId?: number;

  /** 关联的项目对象 */
  project?: Project;
}
