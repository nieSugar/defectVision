<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑限度样' : '添加限度样'"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="限度样名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入限度样名称"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="限度样描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入限度样描述"
        />
      </el-form-item>
      
      <el-form-item label="关联项目" prop="projectId">
        <el-select
          v-model="form.projectId"
          placeholder="请选择关联项目"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="project in projectList"
            :key="project.id"
            :label="project.name"
            :value="project.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { limitSampleService, projectService } from "@/api/project";
import type { LimitSample } from "@/modules";

interface Props {
  modelValue: boolean;
  limitSampleId?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "update-list": [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

const isEdit = computed(() => !!props.limitSampleId);

const formRef = ref<FormInstance>();
const loading = ref(false);
const projectList = ref([]);

const form = reactive<LimitSample>({
  name: "",
  description: "",
  projectId: undefined
});

const rules = {
  name: [{ required: true, message: "请输入限度样名称", trigger: "blur" }],
  projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }]
};

// 加载项目列表
const loadProjectList = async () => {
  try {
    const result = await projectService.getList({ pageIndex: 1, pageSize: 1000 });
    projectList.value = result.data || [];
  } catch (error) {
    ElMessage.error("获取项目列表失败");
  }
};

// 加载限度样详情
const loadLimitSampleDetail = async () => {
  if (!props.limitSampleId) return;
  
  try {
    loading.value = true;
    const result = await limitSampleService.get(props.limitSampleId);
    if (result.data) {
      Object.assign(form, result.data);
    }
  } catch (error) {
    ElMessage.error("获取限度样详情失败");
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: "",
    description: "",
    projectId: undefined
  });
  formRef.value?.clearValidate();
};

// 关闭对话框
const handleClose = () => {
  resetForm();
  visible.value = false;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  
  try {
    loading.value = true;
    
    if (isEdit.value) {
      await limitSampleService.update({ ...form, id: props.limitSampleId });
      ElMessage.success("编辑成功");
    } else {
      await limitSampleService.add(form);
      ElMessage.success("添加成功");
    }
    
    emit("update-list");
    handleClose();
  } catch (error) {
    ElMessage.error(isEdit.value ? "编辑失败" : "添加失败");
  } finally {
    loading.value = false;
  }
};

// 监听对话框显示状态
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      loadProjectList();
      if (isEdit.value) {
        loadLimitSampleDetail();
      } else {
        resetForm();
      }
    }
  }
);

onMounted(() => {
  loadProjectList();
});
</script>
