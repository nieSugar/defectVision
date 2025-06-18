import type { ResourceBase } from "@/utils/models";

export interface Role extends ResourceBase {
  name?: string;
  key?: string;
  status?: boolean;
  manager?: boolean;
  permissions?: Array<number>;
  description?: string;
}
