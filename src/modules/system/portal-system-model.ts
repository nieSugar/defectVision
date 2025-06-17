import type { ResourceBase } from "@/utils/models";

export interface PortalSystem extends ResourceBase {
  /** 地址URL */
  addressUrl?: string;

  /** 名称 */
  name?: string;

  /** 描述 */
  describe?: string;
}
