<template>
  <div class="icon-body">
    <el-input
      v-model="iconName"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #suffix><i class="el-icon-search el-input__icon" /></template>
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        class="icon-item"
        @click="selectedIcon(item)"
      >
        <IconifyIconOffline :icon="item" class="icon-content" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { icons } from "../ReIcon/src/iconifyIconOffline";

const iconName = ref("");
const iconList = ref(icons);
const emit = defineEmits(["selected"]);

function filterIcons() {
  iconList.value = icons;
  if (iconName.value) {
    iconList.value = icons.filter(item => item.indexOf(iconName.value) !== -1);
  }
}

function selectedIcon(name) {
  emit("selected", name);
}

function reset() {
  iconName.value = "";
  iconList.value = icons;
}

defineExpose({
  reset
});
</script>

<style lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
  .icon-item {
    display: flex;
    .icon-content {
      width: 22px;
      height: 30px;
      padding-right: 6px;
    }
  }
}
</style>
