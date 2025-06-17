import type { QueryParam } from "./query-param.model";

export interface ResourceQuery {
  resourceName: string;
  query?: QueryParam;
  sort?: string;
  contentFields?: Array<string>;
}
