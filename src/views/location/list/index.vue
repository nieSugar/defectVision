<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="位置名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入位置名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="关联项目：" prop="projectId">
        <el-select
          v-model="form.projectId"
          placeholder="请选择项目"
          clearable
          class="!w-[200px]"
          filterable
        >
          <el-option
            v-for="project in projectList"
            :key="project.id"
            :label="project.name"
            :value="project.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="位置管理列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addLocation()"> 添加 </el-button>
      </template>
      <template v-slot="{ size }">
        <PureTable
          alignWhole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="columns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="editLocation(row)"
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

    <AddLocationDialog
      v-if="showLocationDialog"
      v-model="showLocationDialog"
      :location-id="selectLocationId"
      @update-list="onSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { PureTableBar } from "@/components/RePureTableBar";
import { FormInstance } from "element-plus";
import { PaginationProps } from "@pureadmin/table";
import { onMounted, reactive, ref } from "vue";
import { useColumns } from "./columns";
import { Search, Refresh } from "@element-plus/icons-vue";
import AddLocationDialog from "../components/add-location-dialog.vue";
import locationService from "@/api/system/location";
import { projectService } from "@/api/project";
import type { Project } from "@/modules/project/project-model";
import { ElMessage } from "element-plus";

const { columns } = useColumns();

const formRef = ref<FormInstance>();
const loading = ref(true);
const dataList = ref([]);
const showLocationDialog = ref(false);
const selectLocationId = ref<number | undefined>();
const projectList = ref<Project[]>([]);

const form = reactive({
  name: "",
  projectId: undefined
});

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

// 搜索
const onSearch = async () => {
  loading.value = true;
  try {
    const params = {
      ...form,
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize
    };

    const result = await locationService.getList(params);
    dataList.value = result.data || [];
    pagination.total = result.totalCount || 0;
  } catch (error) {
    ElMessage.error("获取位置列表失败");
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  onSearch();
};

// 当前页改变
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  onSearch();
};

// 添加位置
const addLocation = () => {
  selectLocationId.value = undefined;
  showLocationDialog.value = true;
};

// 编辑位置
const editLocation = (row: any) => {
  selectLocationId.value = row.id;
  showLocationDialog.value = true;
};

// 删除位置
const handleDelete = async (id: number) => {
  try {
    await locationService.delete(id);
    ElMessage.success("删除成功");
    onSearch();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 获取项目列表
const getProjectList = async () => {
  try {
    const result = await projectService.getList({
      query: {},
      pageIndex: 1,
      pageSize: 1000
    });
    projectList.value = result.data || [];
  } catch (error) {
    console.error("获取项目列表失败", error);
  }
};

onMounted(() => {
  onSearch();
  getProjectList();
});
</script>
