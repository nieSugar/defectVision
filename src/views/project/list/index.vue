<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="项目名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入项目名称"
          clearable
          class="!w-[200px]"
        />
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
      title="项目管理列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addProject()"> 添加 </el-button>
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
              @click="editProject(row)"
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

    <AddProjectDialog
      v-if="showProjectDialog"
      v-model="showProjectDialog"
      :project-id="selectProjectId"
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
import AddProjectDialog from "../components/add-project-dialog.vue";
import { projectService } from "@/api/project";
import { ElMessage } from "element-plus";

const { columns } = useColumns();

const formRef = ref<FormInstance>();
const loading = ref(true);
const dataList = ref([]);
const showProjectDialog = ref(false);
const selectProjectId = ref<number | undefined>();

const form = reactive({
  name: ""
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

    const result = await projectService.getList(params);
    dataList.value = result.data || [];
    pagination.total = result.totalCount || 0;
  } catch (error) {
    ElMessage.error("获取项目列表失败");
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

// 添加项目
const addProject = () => {
  selectProjectId.value = undefined;
  showProjectDialog.value = true;
};

// 编辑项目
const editProject = (row: any) => {
  selectProjectId.value = row.id;
  showProjectDialog.value = true;
};

// 删除项目
const handleDelete = async (id: number) => {
  try {
    await projectService.delete(id);
    ElMessage.success("删除成功");
    onSearch();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

onMounted(() => {
  onSearch();
});
</script>
