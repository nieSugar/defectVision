import type { ResourceBase } from "@/utils/models";
export interface Dictionary extends ResourceBase {
  name?: string;
  value?: string;
  category?: string;
  description?: string;
  createTime?: string;
}
