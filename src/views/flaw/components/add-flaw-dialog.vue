<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="缺陷名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入缺陷名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="缺陷描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入缺陷描述"
        />
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <el-select
          v-model="formData.projectId"
          placeholder="请选择项目"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Flaw, Project } from "@/modules";
import { flawService, projectService } from "@/api/project";

interface Props {
  flawId?: number;
}

const props = withDefaults(defineProps<Props>(), {});

const visible = defineModel({ type: Boolean });

const emit = defineEmits(["updateList"]);

const title = ref("添加缺陷");
const form = ref<FormInstance>();
const loading = ref(false);
const projectOptions = ref<Project[]>([]);

const formData = ref<Flaw>({
  name: "",
  description: "",
  projectId: undefined
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "缺陷名称不能为空", trigger: "blur" }],
  projectId: [{ required: true, message: "请选择项目", trigger: "change" }]
});

async function getProjectOptions() {
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
}

async function getFlawDetail() {
  if (!props.flawId) return;

  try {
    const result = await flawService.get(props.flawId);
    if (result.success) {
      formData.value = { ...result.data };
      title.value = "编辑缺陷";
    }
  } catch (error) {
    console.error("获取缺陷详情失败", error);
  }
}

function handleClose() {
  visible.value = false;
  resetForm();
}

function resetForm() {
  form.value?.resetFields();
  formData.value = {
    name: "",
    description: "",
    projectId: undefined
  };
  title.value = "添加缺陷";
}

async function handleSubmit() {
  if (!form.value) return;

  try {
    await form.value.validate();
    loading.value = true;

    if (props.flawId) {
      await flawService.update({ ...formData.value, id: props.flawId });
      ElMessage.success("编辑成功");
    } else {
      await flawService.add(formData.value);
      ElMessage.success("添加成功");
    }

    emit("updateList");
    handleClose();
  } catch (error) {
    console.error("操作失败", error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => visible.value,
  val => {
    if (val) {
      getFlawDetail();
    }
  }
);

onMounted(() => {
  getProjectOptions();
});
</script>
