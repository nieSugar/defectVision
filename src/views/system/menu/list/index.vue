<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="菜单名称:" prop="name">
        <el-input v-model="form.name" clearable placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSearch">
          搜索
        </el-button>
        <el-button @click="resetForm(formRef)"> 重置</el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :dataList="dataList"
      :loading="loading"
      title="菜单管理列表"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addMenu()"> 添加 </el-button>
      </template>
      <template v-slot="{ size }">
        <PureTable
          :columns="columns"
          :data="dataList"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          :size="size"
          alignWhole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
        >
          <template #icon="{ row }">
            <div class="flex items-center justify-center">
              <IconifyIconOffline :icon="row.icon" />
            </div>
          </template>
          <template #status="{ row }">
            <el-tag type="success">
              {{ row.status == 1 ? "正常" : "停用" }}
            </el-tag>
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="row.type !== 3"
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="addMenu(row.id)"
            >
              添加下级菜单
            </el-button>
            <el-button
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="updateMenu(row.id)"
            >
              修改
            </el-button>
            <el-popconfirm
              title="是否确认删除?"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button
                  :size="size"
                  class="reset-margin"
                  link
                  type="primary"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </PureTableBar>
    <AddMenuDialog
      v-if="showMenuDialog"
      v-model:visible="showMenuDialog"
      :is-add-child="isAddChild"
      :menu-id="selectMenuId"
      @update-list="onSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { PureTableBar } from "@/components/RePureTableBar";
import { FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useColumns } from "./columns";
import { handleTree } from "@/utils/tree";
import AddMenuDialog from "../components/add-menu-dialog.vue";
import menuService from "@/api/system/menu";

const { columns } = useColumns();

const formRef = ref<FormInstance>();
const loading = ref(true);
const dataList = ref([]);
const showMenuDialog = ref(false);
const selectMenuId = ref<number | undefined>();
const isAddChild = ref(false);

const form = reactive<{
  name?: string;
}>({});

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

function updateMenu(id: number) {
  isAddChild.value = false;
  selectMenuId.value = id;
  showMenuDialog.value = true;
}

async function onSearch() {
  loading.value = true;
  const result = await menuService.getList({
    ...form,
    pageIndex: 1,
    pageSize: 10000
  });
  dataList.value = handleTree(result.data);
  loading.value = false;
}

function addMenu(id?: number) {
  selectMenuId.value = id ?? undefined;
  isAddChild.value = !!id;
  showMenuDialog.value = true;
}

async function handleDelete(id: number) {
  await menuService.delete(id);
  await onSearch();
}

onMounted(async () => {
  await onSearch();
});
</script>

<style lang="scss" scoped></style>
