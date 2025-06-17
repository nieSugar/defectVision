import { Plugin } from '@/modules';
import { http } from '@/utils/http';
import { GetResult, ListResult, QueryParam } from '@/utils/models';

class PluginService {
  private baseLink = '/api/plugin';

  public get(id: number): Promise<GetResult<Plugin>> {
    return http.get(`${this.baseLink}/${id}`);
  }

  public getList(params: QueryParam): Promise<ListResult<Plugin>> {
    return http.get(`${this.baseLink}/getPageList`, {
      params: params
    });
  }

  public add(data: Plugin) {
    return http.post(this.baseLink, { data });
  }

  public update(data: Plugin) {
    return http.put(this.baseLink, data);
  }

  public delete(id: number): Promise<boolean> {
    return http.delete(this.baseLink, id);
  }

  public getBySoft(softId: number): Promise<Plugin> {
    return http
      .get(`${this.baseLink}/GetBySoft`, {
        params: {
          softId
        }
      })
      .then((res: GetResult<Plugin>) => res.data);
  }
}

export default PluginService;
