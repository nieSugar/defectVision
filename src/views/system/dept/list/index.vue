<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="部门名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入部门名称" clearable />
      </el-form-item>
      <el-form-item label="部门状态:" prop="status">
        <el-select
          v-model="form.status"
          style="width: 180px"
          placeholder="请选择部门状态"
          clearable
        >
          <el-option
            v-for="dict in stateOptions"
            :key="dict.label"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">
          搜索
        </el-button>
        <el-button @click="resetForm(formRef)"> 重置</el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="部门管理列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addDept()"> 添加 </el-button>
      </template>
      <template v-slot="{ size }">
        <pure-table
          alignWhole="center"
          showOverflowTooltip
          table-layout="auto"
          :data="dataList"
          :size="size"
          :columns="columns"
          row-key="id"
          default-expand-all
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #status="{ row }">
            <el-tag :type="row.status == 1 ? 'success' : 'danger'">
              {{ row.status == 1 ? "正常" : "停用" }}</el-tag
            >
          </template>
          <template #operation="{ row }">
            <el-button
              link
              type="primary"
              :size="size"
              @click="addDept(row.id)"
            >
              添加子部门
            </el-button>
            <el-button
              link
              type="primary"
              :size="size"
              @click="updateDept(row.id)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="是否确认删除?"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <addDeptDialog
      v-if="showDeptDialog"
      v-model:visible="showDeptDialog"
      :parent-id="selectDeptId"
      :deptId="deptId"
      @update-list="onSearch"
    />
  </div>
</template>

<script setup lang="ts">
import deptService from "@/api/user/dept";
import { PureTableBar } from "@/components/RePureTableBar";
import { handleTree } from "@/utils/tree";
import { FormInstance } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import addDeptDialog from "../components/add-dept-dialog.vue";
import { useColumns } from "./columns";
const { columns } = useColumns();

const formRef = ref<FormInstance>();
const loading = ref(true);
const dataList = ref([]);
const showDeptDialog = ref(false);
const selectDeptId = ref<number | undefined>();
const deptId = ref<number | undefined>();

const stateOptions = ref([
  { label: "正常", value: true },
  { label: "停用", value: false }
]);

const form = reactive<{
  name: string;
  status?: boolean;
}>({
  name: ""
});

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

async function onSearch() {
  loading.value = true;
  const { data } = await deptService.getList({ query: form });
  dataList.value = handleTree(data);
  loading.value = false;
}

async function handleDelete(id: number) {
  await deptService.delete(id);
  await onSearch();
}

onMounted(async () => {
  await onSearch();
});

function addDept(id?: number) {
  selectDeptId.value = id ?? undefined;
  showDeptDialog.value = true;
}

function updateDept(id: number) {
  deptId.value = id;
  showDeptDialog.value = true;
}
</script>

<style scoped lang="scss"></style>
