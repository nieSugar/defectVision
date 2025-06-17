<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { useBgStoreHook } from "@/store/modules/bg";
import { getToken } from "@/utils/auth";
import LayNavMix from "../lay-sidebar/NavMix.vue";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";
import LaySidebarBreadCrumb from "../lay-sidebar/components/SidebarBreadCrumb.vue";
import LaySidebarTopCollapse from "../lay-sidebar/components/SidebarTopCollapse.vue";

import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";

const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  userAvatar,
  avatarsStyle,
  toggleSideBar
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

// 组件挂载时获取BG列表
onMounted(() => {
  bgStore.fetchBgList();
});
</script>

<template>
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]">
    <LaySidebarTopCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <LaySidebarBreadCrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <LayNavMix v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 超级管理员：BG选择下拉框 -->
      <el-select
        v-if="isSuperAdmin"
        v-model="bgStore.bgid"
        placeholder="请选择BG"
        class="bg-select"
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
      <!-- 普通用户：只显示当前BG名称 -->
      <div v-else class="bg-display">
        <span class="bg-label">当前BG：</span>
        <span class="bg-name">{{ currentBgName }}</span>
      </div>
      <!-- 全屏 -->
      <LaySidebarFullScreen id="full-screen" />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
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
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .bg-select {
      width: 150px;
      margin-right: 16px;
    }

    .bg-display {
      display: flex;
      align-items: center;
      margin-right: 16px;
      padding: 8px 12px;
      background-color: #f5f7fa;
      border-radius: 4px;
      font-size: 14px;

      .bg-label {
        color: #606266;
        margin-right: 8px;
      }

      .bg-name {
        color: #303133;
        font-weight: 500;
      }
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
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
