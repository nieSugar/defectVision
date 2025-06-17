import { Pretreatment } from '@/modules';
import { http } from '@/utils/http';
import { GetResult, ListResult, QueryParam } from '@/utils/models';

class PretreatmentService {
  private baseLink = '/api/pretreatment';

  public get(id: number): Promise<GetResult<Pretreatment>> {
    return http.get(`${this.baseLink}/${id}`);
  }

  public getList(params: QueryParam): Promise<ListResult<Pretreatment>> {
    return http.get(`${this.baseLink}/getPageList`, {
      params: params
    });
  }

  public add(data: Pretreatment) {
    return http.post(this.baseLink, { data });
  }

  public update(data: Pretreatment) {
    return http.put(this.baseLink, data);
  }

  public delete(id: number): Promise<boolean> {
    return http.delete(this.baseLink, id);
  }

  public getBySoft(softId: number): Promise<Pretreatment> {
    return http
      .get(`${this.baseLink}/GetBySoft`, {
        params: {
          softId
        }
      })
      .then((res: GetResult<Pretreatment>) => res.data);
  }

  public getCal(id: number, fileId: string): Promise<Array<string>> {
    return http.get(`${this.baseLink}/cal/${id}/${fileId}`).then(
      (
        res: GetResult<{
          success: boolean;
          output: Array<string>;
        }>
      ) => {
        if (!res.data.success) throw new Error('获取预处理失败');
        return res.data.output;
      }
    );
  }
}

export default PretreatmentService;
