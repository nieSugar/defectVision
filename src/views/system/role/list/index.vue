<template>
  <div>
    <el-form ref="formRef" :model="form" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="key">
        <el-input
          v-model="form.key"
          placeholder="请输入权限字符"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="角色状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in stateOptions"
            :key="dict.value.toString()"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="角色管理列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <!-- <el-button type="primary" @click="addUser()">添加</el-button> -->
      </template>
      <template v-slot="{ size }">
        <PureTable
          alignWhole="center"
          showOverflowTooltip
          table-layout="auto"
          :size="size"
          :data="dataList"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          default-expand-all
          :paginationSmall="size === 'small'"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #status="{ row }">
            <div>
              <el-switch
                v-model="row.status"
                :active-value="true"
                :inactive-value="false"
                @click="handleStatusChange(row)"
              />
            </div>
          </template>
          <template #operation="{ row }">
            <!-- <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="editRole(row)"
            >
              编辑
            </el-button> -->
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="assignPermissions(row)"
            >
              分配权限
            </el-button>
            <!-- <el-popconfirm
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
            </el-popconfirm> -->
          </template>
        </PureTable>
      </template>
    </PureTableBar>
    <addRoleDialog
      v-if="showAddDialog"
      v-model:visible="showAddDialog"
      :role="role"
      @update-list="onSearch"
    />
    <assignPermissionsDialog
      v-if="showAssignDialog"
      v-model:visible="showAssignDialog"
      :role="selectedRole"
      @update-list="onSearch"
    />
  </div>
</template>

<script setup lang="ts">
import roleService from "@/api/user/role";
import { PureTableBar } from "@/components/RePureTableBar";
import { PaginationProps } from "@pureadmin/table";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useColumns } from "./columns";
import addRoleDialog from "../components/add-role-dialog.vue";
import assignPermissionsDialog from "../components/assign-permissions-dialog.vue";
import { Role } from "@/modules";
const { columns } = useColumns();

const formRef = ref<FormInstance>();

const loading = ref(false);
const showAddDialog = ref(false);
const showAssignDialog = ref(false);

let role = undefined;
let selectedRole = ref<Role | undefined>(undefined);

const form = reactive({
  name: "",
  status: null,
  pageIndex: 1,
  pageSize: 10,
  key: ""
});

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const stateOptions = ref([
  { label: "启用", value: true },
  { label: "禁用", value: false }
]);

const dataList = ref([]);

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

function addUser() {
  role = undefined;
  showAddDialog.value = true;
}

function editRole(row: Role) {
  role = row;
  showAddDialog.value = true;
}

function assignPermissions(row: Role) {
  selectedRole.value = row;
  showAssignDialog.value = true;
}

async function handleDelete(id: number) {
  await roleService.delete(id);
  ElMessage.success("删除成功");
  onSearch();
}

function handleStatusChange(row: Role) {
  const text = row.status ? "启用" : "停用";
  ElMessageBox.confirm(`确定要${text} ${row.name}吗？`, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(function () {
      return roleService.changeStatus(row.id, row.status);
    })
    .then(() => {
      ElMessage.success(`${text}成功`);
    })
    .catch(function () {
      row.status = !row.status;
    });
}

async function onSearch() {
  loading.value = true;
  const result = await roleService.getList({
    ...form,
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
