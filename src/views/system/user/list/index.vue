<template>
  <div>
    <el-form ref="formRef" :model="form" :inline="true" label-width="68px">
      <el-form-item label="用户名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="form.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="用户状态"
          clearable
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
      <el-form-item label="创建时间" prop="createdTime" style="width: 308px">
        <el-date-picker
          v-model="form.createdTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="resetForm"> 重置</el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="用户管理列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addUser()"> 添加 </el-button>
      </template>
      <template v-slot="{ size }">
        <PureTable
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="columns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #status="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="true"
              :inactive-value="false"
              @click="handleStatusChange(row)"
            />
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleEdit(row)"
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
        </PureTable>
      </template>
    </PureTableBar>
    <addUserDialog
      v-if="userDialog"
      v-model:visible="userDialog"
      :user-id="selectUser?.id"
      @update-list="onSearch"
    />
  </div>
</template>

<script setup lang="ts">
import userService from "@/api/user/user";
import { PureTableBar } from "@/components/RePureTableBar";
import { User } from "@/modules";
import { PaginationProps } from "@pureadmin/table";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import addUserDialog from "../components/add-user-dialog.vue";
import { useColumns } from "./columns";
const { columns } = useColumns();

const formRef = ref<FormInstance>();

const loading = ref(false);
const userDialog = ref(false);
const form = reactive({
  name: "",
  status: "",
  phoneNumber: "",
  pageIndex: 1,
  pageSize: 10,
  createdTime: ""
});

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const stateOptions = ref([
  { label: "启用", value: 1 },
  { label: "禁用", value: 2 }
]);

const dataList = ref([]);

const resetForm = () => {
  formRef.value?.resetFields();
  pagination.currentPage = 1;
  onSearch();
};

let selectUser = null;

function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  onSearch();
}

function handleSizeChange(val: number) {
  pagination.pageSize = val;
  onSearch();
}

function handleStatusChange(row: User) {
  const text = row.status ? "启用" : "停用";
  ElMessageBox.confirm(`确定要${text} ${row.userName}用户吗？`, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(function () {
      return userService.changeStatus(row.id, row.status);
    })
    .then(() => {
      ElMessage.success(`${text}成功`);
      onSearch();
    })
    .catch(function () {
      row.status = !row.status;
    });
}

function addUser() {
  selectUser = null;
  userDialog.value = true;
}

function handleEdit(row) {
  selectUser = row;
  userDialog.value = true;
}

async function handleDelete(userId: number) {
  await userService.delete(userId);
  ElMessage.success("删除成功");
  onSearch();
}

async function onSearch() {
  loading.value = true;
  const [StartTime, EndTime] = Array.isArray(form.createdTime)
    ? form.createdTime
    : ["", ""];
  const result = await userService.getList({
    name: form.name,
    status: form.status,
    phoneNumber: form.phoneNumber,
    startDate: StartTime || undefined,
    endDate: EndTime || undefined,
    pageIndex: pagination.currentPage,
    pageSize: pagination.pageSize
  });
  dataList.value = result.data;
  pagination.total = result.totalCount;
  loading.value = false;
}

onMounted(async () => {
  await onSearch();
});
</script>

<style scoped></style>
