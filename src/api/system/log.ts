import type { Log } from "@/modules";
import { http } from "@/utils/http";
import type { ListQuery, ListResult } from "@/utils/models";

class LogService {
  private baseUrl = "/api/syslog";

  public getList(data: ListQuery): Promise<ListResult<Log>> {
    return http.get<ListQuery, ListResult<Log>>(`${this.baseUrl}`, {
      params: data
    });
  }
}

export default LogService;
