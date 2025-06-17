import type { ResourceBase } from "@/utils/models";

export interface User extends ResourceBase {
  userName?: string;
  nickName?: string;
  deptId?: number;
  phoneNumber?: string;
  roleIds?: Array<string>;
  status?: boolean;
  email?: string;
  description?: string;
  password?: string;
}
