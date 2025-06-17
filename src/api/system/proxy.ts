import { Proxy } from '@/modules';
import { http } from '@/utils/http';
import { GetResult, ListResult, QueryParam } from '@/utils/models';

class ProxyService {
  private baseLink = '/api/caeProxy';

  public get(id: number): Promise<GetResult<Proxy>> {
    return http.get(`${this.baseLink}/${id}`);
  }

  public getList(params: QueryParam): Promise<ListResult<Proxy>> {
    return http.get(`${this.baseLink}/getPageList`, {
      params: params
    });
  }

  public add(data: Proxy) {
    return http.post(this.baseLink, { data });
  }

  public update(data: Proxy) {
    return http.put(this.baseLink, data);
  }

  public delete(id: number): Promise<boolean> {
    return http.delete(this.baseLink, id);
  }

  public getBySoft(softId: number): Promise<Proxy> {
    return http
      .get(`${this.baseLink}/GetBySoft`, {
        params: {
          softId
        }
      })
      .then((res: GetResult<Proxy>) => {
        return res.data;
      });
  }
}

export default ProxyService;
