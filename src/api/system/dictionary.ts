import type { Dictionary, DictionaryAll } from "@/modules";
import { http } from "@/utils/http";
import type { GetResultList, Result, SelectItem } from "@/utils/models";

class DictionaryService {
  private baseUrl = "/api/sysDic";

  public get(id: number): Promise<Result<Dictionary>> {
    return http.get(`${this.baseUrl}/${id}`);
  }

  public getList(): Promise<GetResultList<DictionaryAll>> {
    return http.get(`${this.baseUrl}/tree`);
  }

  public add(data: Dictionary) {
    return http.post(this.baseUrl, { data });
  }

  public update(data: Dictionary) {
    return http.put(this.baseUrl, data);
  }

  public delete(id: number): Promise<boolean> {
    return http.delete(this.baseUrl, id);
  }

  public getPageOptions() {
    return http.get(`${this.baseUrl}/GetPageOptions`);
  }

  public getCodeItem(
    code: string
  ): Promise<GetResultList<{ key: string; value: string }>> {
    return http.get(`${this.baseUrl}/GetWithBaseCode`, { params: { code } });
  }

  public async getCodeItemToItem(codes: Array<string>) {
    const promiseRes: Array<
      Promise<GetResultList<{ key: string; value: string }>>
    > = [];
    codes.forEach(s => {
      promiseRes.push(this.getCodeItem(s));
    });
    const data = await Promise.all(promiseRes);

    return data.map(s => {
      return this.mapDataToItem(s.data);
    });
  }

  private mapDataToItem(datas: Array<{ key: string; value: string }>) {
    const options: Array<SelectItem> = datas.map(s => {
      return { label: s.value, value: s.key };
    });
    return options;
  }
}

export default new DictionaryService();
