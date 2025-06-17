import userService, { type UserResult } from "@/api/user/user";
import { type DataInfo, removeToken, setToken, userKey } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import {
  type userType,
  resetRouter,
  router,
  routerArrays,
  storageLocal,
  store
} from "../utils";
import { useMultiTagsStoreHook } from "./multiTags";
import { useBgStoreHook } from "./bg";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        userService
          .login(data)
          .then(data => {
            if (data.code === 200) setToken(this.mapToken(data.data));
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();

      // 清除BG相关状态
      const bgStore = useBgStoreHook();
      bgStore.SET_IS_ADMIN(false);
      bgStore.SET_BGID(undefined);

      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    mapToken(token) {
      const {
        exp,
        NickName,
        BGId: bgid
      } = jwtDecode<{
        exp: string;
        NickName: string;
        UserId: number;
        BGId?: number;
      }>(token);

      // 如果token中包含bgid，设置到bg store中
      if (bgid !== undefined && bgid !== null) {
        const bgStore = useBgStoreHook();
        bgStore.SET_BGID(bgid);

        // 如果bgid为0，标识为管理员
        const isAdmin = bgid == 0;
        bgStore.SET_IS_ADMIN(isAdmin);
      }

      const tokenDataInfo: DataInfo<Date> = {
        accessToken: token,
        expires: new Date(Number(exp) * 1000),
        username: NickName,
        bgid
      };
      return tokenDataInfo;
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
