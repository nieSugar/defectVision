<template>
  <div>
    <el-form ref="formRef" :inline="true" :model="form" label-width="68px">
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="form.title"
          clearable
          placeholder="请输入系统模块"
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="form.operName"
          clearable
          placeholder="请输入操作人员"
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          v-model="form.businessType"
          clearable
          placeholder="操作类型"
          style="width: 240px"
        >
          <el-option
            v-for="dict in businessTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          clearable
          placeholder="操作状态"
          style="width: 240px"
        >
          <el-option
            v-for="dict in stateOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间" style="width: 308px">
        <el-date-picker
          v-model="dateRange"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 1, 1, 23, 59, 59)
          ]"
          end-placeholder="结束日期"
          range-separator="-"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="resetForm(formRef)">重置</el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :dataList="dataList"
      :loading="loading"
      title="操作日志列表"
      @refresh="onSearch"
    >
      <template v-slot="{ size }">
        <PureTable
          :columns="columns"
          :data="dataList"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          :size="size"
          alignWhole="center"
          default-expand-all
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #status="{ row }">
            <div>
              {{ row.status === 1 ? "成功" : "失败" }}
            </div>
          </template>
          <template #operation>
            <el-button :size="size" class="reset-margin" link type="primary">
              查看
            </el-button>
          </template>
        </PureTable>
      </template>
    </PureTableBar>
  </div>
</template>

<script lang="ts" setup>
import LogService from "@/api/system/log";
import { PureTableBar } from "@/components/RePureTableBar";
import { PaginationProps } from "@pureadmin/table";
import { FormInstance } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { useColumns } from "./columns";
import { useBgStoreHook } from "@/store/modules/bg";

const { columns } = useColumns();
const bgStore = useBgStoreHook();

const formRef = ref<FormInstance>();

const loading = ref(false);

const form = reactive<{
  name?: string;
  title?: string;
  status?: string;
  businessType?: string;
  operName?: string;
  createTime?: string;
  Key?: string;
  deptId?: string;
  action?: string;
  module?: string;
}>({});

const dateRange = ref("");

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const stateOptions = ref([
  { label: "成功", value: 1 },
  { label: "失败", value: 2 }
]);

const businessTypeOptions = ref([
  { label: "其它", value: 0 },
  { label: "新增", value: 1 },
  { label: "修改", value: 2 },
  { label: "删除", value: 3 }
]);

const dataList = ref([]);

const logService = new LogService();

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  onSearch();
}

function handleSizeChange(val: number) {
  pagination.pageSize = val;
  onSearch();
}

async function onSearch() {
  loading.value = true;
  const result = await logService.getList({
    ...form,
    pageIndex: pagination.currentPage,
    pageSize: pagination.pageSize
  });
  dataList.value = result.data;
  pagination.total = result.totalCount;
  loading.value = false;
}

watch(
  () => bgStore.bgid,
  newBgid => {
    if (newBgid) {
      onSearch();
    }
  }
);

onMounted(async () => {
  await onSearch();
});
</script>

<style scoped></style>
