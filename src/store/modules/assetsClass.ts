import { defineStore } from "pinia";
import { message } from "@/utils/message";

interface AssetsClassItem {
  id: number;
  name: string;
}

interface AssetsClassState {
  dataList: AssetsClassItem[];
  loading: boolean;
  pagination: {
    total: number;
    pageSize: number;
    currentPage: number;
    background: boolean;
  };
}

export const useAssetsClassStore = defineStore({
  id: "assetsClass",
  state: (): AssetsClassState => ({
    dataList: [],
    loading: false,
    pagination: {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      background: true
    }
  }),
  actions: {
    async fetchAssetsClass() {
      this.loading = true;
      try {
        // 模拟 API 调用
        // 实际使用中替换为真正的 API 请求
        // const { data } = await api.getAssetsClass()
        const data = {
          list: this.dataList,
          total: this.dataList.length
        };

        this.dataList = data.list;
        this.pagination.total = data.total;
      } catch (error) {
        console.error("获取资产类别失败:", error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },

    async deleteAssetsClass(row: AssetsClassItem) {
      try {
        // 模拟 API 调用
        // 实际使用中替换为真正的 API 请求
        // await api.deleteAssetsClass(row.id)

        this.dataList = this.dataList.filter(item => item.id !== row.id);
        message(`${row.name}已删除`, { type: "success" });
        await this.fetchAssetsClass();
      } catch (error) {
        console.error("删除资产类别失败:", error);
        message("删除失败", { type: "error" });
      }
    },

    async addAssetsClass(form: Omit<AssetsClassItem, "id">) {
      try {
        // 模拟 API 调用
        // 实际使用中替换为真正的 API 请求
        // const res = await api.addAssetsClass(form)

        // 生成新ID (模拟)
        const newId =
          this.dataList.length > 0
            ? Math.max(...this.dataList.map(item => item.id)) + 1
            : 1;

        this.dataList.push({
          id: newId,
          ...form
        });

        message("添加成功", { type: "success" });
        await this.fetchAssetsClass();
      } catch (error) {
        console.error("添加资产类别失败:", error);
        message("添加失败", { type: "error" });
      }
    }
  }
});
