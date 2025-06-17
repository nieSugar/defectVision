<template>
  <div>
    <el-form ref="formRef" :model="form" :inline="true" label-width="68px">
      <el-form-item label="关键字" prop="key">
        <el-input
          v-model="form.key"
          placeholder="请输入关键字"
          clearable
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar
      :dataList="dataList"
      :loading="loading"
      title="菜单管理列表"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addRes()"> 添加 </el-button>
      </template>
      <template v-slot="{ size }">
        <PureTable
          alignWhole="center"
          showOverflowTooltip
          table-layout="auto"
          :data="dataList"
          :columns="columns"
          row-key="id"
          :size="size"
          default-expand-all
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              @click="editRes(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="是否确认删除?"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button class="reset-margin" link type="primary">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </PureTableBar>
    <addDictionaryDialog
      v-if="showAddDialog"
      v-model="showAddDialog"
      :dictionary="dictionary"
      @update-list="onSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import addDictionaryDialog from "../components/add-dictionary-dialog.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useColumns } from "./columns";
import { Dictionary } from "@/modules";
import dictionaryService from "@/api/user/dictionary";

const { columns } = useColumns();

const formRef = ref<FormInstance>();

const loading = ref(false);
const showAddDialog = ref(false);

let dictionary = undefined;

const form = reactive({ key: "" });

const dataList = ref([]);

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

function addRes() {
  dictionary = undefined;
  showAddDialog.value = true;
}

function editRes(row: Dictionary) {
  dictionary = row;
  showAddDialog.value = true;
}

async function handleDelete(id) {
  await dictionaryService.delete(id);
  ElMessage.success("删除成功");
  onSearch();
}

async function onSearch() {
  loading.value = true;
  const { data } = await dictionaryService.getList({
    query: { ...form }
  });
  dataList.value = data;
  loading.value = false;
}

onMounted(async () => {
  await onSearch();
});
</script>

<style scoped></style>
