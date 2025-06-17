<script setup lang="ts">
import { emitter } from "@/utils/mitt";
import { useNav } from "@/layout/hooks/useNav";
import { responsiveStorageNameSpace } from "@/config";
import { ref, nextTick, computed, onMounted } from "vue";
import { storageLocal, isAllEmpty } from "@pureadmin/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useBgStoreHook } from "@/store/modules/bg";
import { getToken } from "@/utils/auth";
import LaySidebarItem from "../lay-sidebar/components/SidebarItem.vue";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";

import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";

const menuRef = ref();
const showLogo = ref(
  storageLocal().getItem<StorageConfigs>(
    `${responsiveStorageNameSpace()}configure`
  )?.showLogo ?? true
);

const {
  route,
  title,
  logout,
  onPanel,
  getLogo,
  username,
  userAvatar,
  backTopMenu,
  avatarsStyle,
  menuSelect
} = useNav();

const bgStore = useBgStoreHook();

// 判断是否为超级管理员（bgid为0）
const isSuperAdmin = computed(() => {
  return bgStore.getIsAdmin;
});

// 获取当前BG名称
const currentBgName = computed(() => {
  return bgStore.getCurrentBg?.name || "未选择BG";
});

// 处理BG选择变化
const handleBgChange = (bgid: number) => {
  bgStore.selectBg(bgid);
};

const defaultActive = computed(() =>
  !isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path
);

nextTick(() => {
  menuRef.value?.handleResize();
});

onMounted(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
  // 组件挂载时获取BG列表
  bgStore.fetchBgList();
});
</script>

<template>
  <div
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
    class="horizontal-header"
  >
    <div v-if="showLogo" class="horizontal-header-left" @click="backTopMenu">
      <img :src="getLogo()" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <el-menu
      ref="menuRef"
      mode="horizontal"
      popper-class="pure-scrollbar"
      class="horizontal-header-menu"
      :default-active="defaultActive"
      @select="menuSelect"
    >
      <LaySidebarItem
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 全屏 -->
      <LaySidebarFullScreen id="full-screen" />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover">
          <img :src="userAvatar" :style="avatarsStyle" />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <!-- 超级管理员：BG选择 -->
            <template v-if="isSuperAdmin">
              <el-dropdown-item disabled class="bg-selector-item">
                <div class="bg-selector-container">
                  <span class="bg-label">选择BG：</span>
                  <el-select
                    v-model="bgStore.bgid"
                    placeholder="请选择BG"
                    size="small"
                    class="bg-select-dropdown"
                    :loading="bgStore.loading"
                    @change="handleBgChange"
                  >
                    <el-option
                      v-for="bg in bgStore.bgList"
                      :key="bg.id"
                      :label="bg.name"
                      :value="bg.id"
                    />
                  </el-select>
                </div>
              </el-dropdown-item>
              <el-divider style="margin: 8px 0" />
            </template>
            <!-- 普通用户：显示当前BG -->
            <template v-else>
              <el-dropdown-item disabled class="bg-display-item">
                <div class="bg-display-container">
                  <span class="bg-label">当前BG：</span>
                  <span class="bg-name">{{ currentBgName }}</span>
                </div>
              </el-dropdown-item>
              <el-divider style="margin: 8px 0" />
            </template>
            <!-- 退出登录 -->
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        class="set-icon navbar-bg-hover"
        title="打开系统配置"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.user-dropdown {
  min-width: 200px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }

  .bg-selector-item,
  .bg-display-item {
    cursor: default !important;

    &:hover {
      background-color: transparent !important;
    }
  }

  .bg-selector-container,
  .bg-display-container {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 4px 0;
  }

  .bg-label {
    font-size: 12px;
    color: var(--el-text-color-regular);
    margin-right: 8px;
    white-space: nowrap;
  }

  .bg-select-dropdown {
    flex: 1;
    min-width: 120px;
  }

  .bg-name {
    font-size: 12px;
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}
</style>
