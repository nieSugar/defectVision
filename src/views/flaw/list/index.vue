<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="缺陷名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入缺陷名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="项目：" prop="projectId">
        <el-select
          v-model="form.projectId"
          placeholder="请选择项目"
          clearable
          filterable
          class="!w-[200px]"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
      title="缺陷管理列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addFlaw()"> 添加 </el-button>
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
              @click="editFlaw(row)"
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

    <AddFlawDialog
      v-if="showFlawDialog"
      v-model="showFlawDialog"
      :flaw-id="selectFlawId"
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
import AddFlawDialog from "../components/add-flaw-dialog.vue";
import { flawService, projectService } from "@/api/project";
import { ElMessage } from "element-plus";
import { Project } from "@/modules";

const { columns } = useColumns();

const formRef = ref<FormInstance>();
const loading = ref(true);
const dataList = ref([]);
const showFlawDialog = ref(false);
const selectFlawId = ref<number | undefined>();
const projectOptions = ref<Project[]>([]);

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

    const result = await flawService.getList(params);
    dataList.value = result.data || [];
    pagination.total = result.totalCount || 0;
  } catch (error) {
    ElMessage.error("获取缺陷列表失败");
  } finally {
    loading.value = false;
  }
};

// 获取项目选项
const getProjectOptions = async () => {
  try {
    const result = await projectService.getList({
      pageIndex: 1,
      pageSize: 1000
    });
    if (result.success) {
      projectOptions.value = result.data || [];
    }
  } catch (error) {
    console.error("获取项目列表失败", error);
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

// 添加缺陷
const addFlaw = () => {
  selectFlawId.value = undefined;
  showFlawDialog.value = true;
};

// 编辑缺陷
const editFlaw = (row: any) => {
  selectFlawId.value = row.id;
  showFlawDialog.value = true;
};

// 删除缺陷
const handleDelete = async (id: number) => {
  try {
    await flawService.delete(id);
    ElMessage.success("删除成功");
    onSearch();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

onMounted(() => {
  onSearch();
  getProjectOptions();
});
</script>
