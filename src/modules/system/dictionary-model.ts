import type { ResourceBase } from "@/utils/models";

export interface Dictionary extends ResourceBase {
  /** 名称 */
  name?: string;

  /** 类型 */
  baseId?: number;

  /** 编码 */
  code?: string;

  /** 描述 */
  description?: string;

  children?: Array<Dictionary>;
}

export interface DictionaryAll {
  current?: Dictionary;
  values?: Array<DictionaryAll>;
}
