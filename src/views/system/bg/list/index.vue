<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg-opacity-50 px-8 pt-[12px] pb-[12px]"
    >
      <el-form-item label="名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="位置：" prop="code">
        <el-input
          v-model="form.code"
          placeholder="请输入位置"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :dataList="dataList"
      :loading="loading"
      title="BG管理列表"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addBG()"> 添加 </el-button>
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
          <template #status="{ row }">
            <el-tag
              :type="row.status === 1 ? 'success' : 'danger'"
              effect="plain"
            >
              {{ row.status === 1 ? "正常" : "停用" }}
            </el-tag>
          </template>
          <template #operation="{ row }">
            <el-button
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="updateBG(row.id)"
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
    <AddBGDialog
      v-if="showBGDialog"
      v-model:visible="showBGDialog"
      :bg-id="selectBGId"
      @update-list="onSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { PaginationProps } from "@pureadmin/table";
import { onMounted, reactive, ref, watch } from "vue";
import AddBGDialog from "../components/add-bg-dialog.vue";
import bgService from "@/api/system/bg";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useBgStoreHook } from "@/store/modules/bg";

const bgStore = useBgStoreHook();

// 定义表格列
const columns = ref([
  {
    label: "序号",
    type: "index",
    width: 70
  },
  {
    label: "名称",
    prop: "name",
    minWidth: 150
  },
  {
    label: "位置",
    prop: "code",
    minWidth: 200
  },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth: 180,
    formatter: ({ createTime }) =>
      createTime ? new Date(createTime).toLocaleString() : ""
  },
  {
    label: "备注",
    prop: "describe",
    minWidth: 150
  },
  {
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  }
]);

const formRef = ref<FormInstance>();
const loading = ref(true);
const dataList = ref([]);
const showBGDialog = ref(false);
const selectBGId = ref<number | undefined>();

const form = reactive({
  name: "",
  code: ""
});

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function resetForm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
}

async function onSearch() {
  loading.value = true;
  try {
    const data = await bgService.getList({
      ...form,
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    dataList.value = data.data;
    pagination.total = data.totalCount;
  } catch (error) {
    console.error("获取列表失败:", error);
    dataList.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
}

function updateBG(id: number) {
  selectBGId.value = id;
  showBGDialog.value = true;
}

function addBG() {
  selectBGId.value = undefined;
  showBGDialog.value = true;
}

async function handleDelete(id: number) {
  await bgService.delete(id);
  await onSearch();
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

<style lang="scss" scoped></style>
