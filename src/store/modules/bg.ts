import { defineStore } from "pinia";
import { type bgType, store, storageLocal } from "../utils";
import bgService from "@/api/system/bg";
import type { BGManager } from "@/modules";

const BG_STORAGE_KEY = "bg-info";

export const useBgStore = defineStore({
  id: "pure-bg",
  state: (): bgType => ({
    bgid: storageLocal().getItem<{ bgid: number; isAdmin: boolean }>(
      BG_STORAGE_KEY
    )?.bgid,
    bgList: [],
    loading: false,
    isAdmin:
      storageLocal().getItem<{ bgid: number; isAdmin: boolean }>(BG_STORAGE_KEY)
        ?.isAdmin ?? false
  }),
  getters: {
    getBgid(state) {
      return state.bgid;
    },
    getBgList(state) {
      return state.bgList;
    },
    getCurrentBg(state) {
      return state.bgList?.find(bg => bg.id === state.bgid);
    },
    getIsAdmin(state) {
      return state.isAdmin;
    }
  },
  actions: {
    /** 设置当前选中的BG ID */
    SET_BGID(bgid: number | undefined) {
      this.bgid = bgid;
      // 持久化存储bgid和isAdmin
      if (bgid !== undefined) {
        storageLocal().setItem(BG_STORAGE_KEY, { bgid, isAdmin: this.isAdmin });
      } else {
        storageLocal().removeItem(BG_STORAGE_KEY);
      }
    },
    /** 设置BG列表 */
    SET_BG_LIST(bgList: Array<BGManager>) {
      this.bgList = bgList;
    },
    /** 设置加载状态 */
    SET_LOADING(loading: boolean) {
      this.loading = loading;
    },
    /** 设置管理员状态 */
    SET_IS_ADMIN(isAdmin: boolean) {
      this.isAdmin = isAdmin;
      // 持久化存储isAdmin状态
      if (this.bgid !== undefined) {
        storageLocal().setItem(BG_STORAGE_KEY, { bgid: this.bgid, isAdmin });
      } else {
        // 如果bgid为undefined，只存储isAdmin状态
        storageLocal().setItem(BG_STORAGE_KEY, { isAdmin });
      }
    },
    /** 获取BG列表 */
    async fetchBgList() {
      this.SET_LOADING(true);
      try {
        // 调用不带参数的getList方法获取所有数据
        const result = await bgService.getList();
        this.SET_BG_LIST(result.data);

        // 如果没有选中的BG且列表不为空，默认选中第一个
        // 对于管理员（bgid=0），也需要默认选中第一个BG
        if (
          (!this.bgid || (this.isAdmin && this.bgid == 0)) &&
          result.data.length > 0
        ) {
          this.SET_BGID(result.data[0].id);
        }
      } catch (error) {
        console.error("获取BG列表失败:", error);
        this.SET_BG_LIST([]);
      } finally {
        this.SET_LOADING(false);
      }
    },
    /** 选择BG */
    selectBg(bgid: number) {
      this.SET_BGID(bgid);
    }
  }
});

export function useBgStoreHook() {
  return useBgStore(store);
}
