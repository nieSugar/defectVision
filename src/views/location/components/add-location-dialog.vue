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
      <el-form-item label="位置名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入位置名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入位置描述"
        />
      </el-form-item>
      <el-form-item label="关联项目" prop="projectId">
        <el-select
          v-model="formData.projectId"
          placeholder="请选择项目"
          clearable
          style="width: 100%"
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import type { Location } from "@/modules/system/location-model";
import type { Project } from "@/modules/project/project-model";
import locationService from "@/api/system/location";
import { projectService } from "@/api/project";

interface Props {
  locationId?: number;
}

const props = withDefaults(defineProps<Props>(), {});

const visible = defineModel({ type: Boolean });

const emit = defineEmits(["updateList"]);

const title = ref("添加位置");
const form = ref<FormInstance>();
const loading = ref(false);
const projectList = ref<Project[]>([]);

const formData = ref<Location>({
  name: "",
  description: "",
  projectId: undefined
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "位置名称不能为空", trigger: "blur" }],
  projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }]
});

// 获取项目列表
async function getProjectList() {
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
}

async function getLocationDetail() {
  if (!props.locationId) return;

  try {
    const result = await locationService.get(props.locationId);
    if (result.data) {
      formData.value = { ...result.data };
      title.value = "编辑位置";
    }
  } catch (error) {
    console.error("获取位置详情失败", error);
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
  title.value = "添加位置";
}

async function handleSubmit() {
  if (!form.value) return;

  try {
    await form.value.validate();
    loading.value = true;
    if (props.locationId) {
      await locationService.update({ ...formData.value, id: props.locationId });
      ElMessage.success("编辑成功");
    } else {
      await locationService.add(formData.value);
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

onMounted(() => {
  getProjectList();
  if (props.locationId) {
    getLocationDetail();
  }
});
</script>
