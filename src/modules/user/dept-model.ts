import type { ResourceBase } from "@/utils/models";

export interface Dept extends ResourceBase {
  name?: string;
  parentId?: number;
  status?: boolean;
  createTime?: string;
}
