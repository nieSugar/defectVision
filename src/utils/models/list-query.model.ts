import type { HttpStatusCode } from "axios";
import type { QueryParam } from "./query-param.model";

export interface ListQuery {
  pageSize?: number;
  pageIndex?: number;
  sort?: string;
  [key: string]: any;
  query?: QueryParam;
}

export interface ListResult<T> {
  success: boolean;
  code: HttpStatusCode;
  data: Array<T>;
  message: string;
  totalCount: number;
}

export interface Result<T> {
  success: boolean;
  code: HttpStatusCode;
  data: T;
  message: string;
}

export interface GetResultList<T> {
  success: boolean;
  code: HttpStatusCode;
  data: Array<T>;
  message: string;
}
