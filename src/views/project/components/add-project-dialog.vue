<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="800"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入项目名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              placeholder="请输入项目描述"
              :rows="4"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="3D模型文件">
            <FileUpload
              v-model="formData.url_3D"
              :multiple="false"
              :limit="1"
              accept=".obj,.fbx,.gltf,.glb,.3ds,.dae,.ply,.stl"
              button-text="选择3D模型文件"
              tip="支持 .obj, .fbx, .gltf, .glb, .3ds, .dae, .ply, .stl 格式，文件大小不超过50MB"
              :max-size="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目图片">
            <FileUpload
              v-model="formData.images"
              :multiple="true"
              :limit="10"
              accept="image/*"
              list-type="picture-card"
              tip="支持 jpg, png, gif 格式，最多上传10张图片，每张图片不超过5MB"
              :max-size="5"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Project } from "@/modules";
import { projectService } from "@/api/project";
import FileUpload from "@/components/FileUpload/index.vue";

interface Props {
  projectId?: number;
}

const props = withDefaults(defineProps<Props>(), {});

const visible = defineModel({ type: Boolean });

const emit = defineEmits(["updateList"]);

const title = ref("添加项目");
const form = ref<FormInstance>();
const loading = ref(false);

const formData = ref<Project>({
  name: "",
  description: "",
  url_3D: "",
  images: []
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "项目名称不能为空", trigger: "blur" }]
});

let isCreate = true;

onMounted(() => {
  resetForm();
  if (props.projectId) {
    isCreate = false;
    title.value = "编辑项目";
    getProjectDetail();
  } else {
    isCreate = true;
    title.value = "添加项目";
  }
});

// 重置表单
const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    url_3D: "",
    images: []
  };
  form.value?.clearValidate();
};

// 获取项目详情
const getProjectDetail = async () => {
  if (!props.projectId) return;

  try {
    loading.value = true;
    const result = await projectService.get(props.projectId);
    if (result.success && result.data) {
      formData.value = {
        ...result.data,
        images: result.data.images || []
      };
    }
  } catch (error) {
    ElMessage.error("获取项目详情失败");
  } finally {
    loading.value = false;
  }
};

// 关闭对话框
const closeDialog = () => {
  visible.value = false;
};

// 提交表单
const handleSubmit = async () => {
  if (!form.value) return;

  try {
    const valid = await form.value.validate();
    if (!valid) return;

    loading.value = true;

    const submitData = {
      ...formData.value,
      images: Array.isArray(formData.value.images) ? formData.value.images : []
    };

    if (isCreate) {
      await projectService.add(submitData);
      ElMessage.success("添加成功");
    } else {
      submitData.id = props.projectId;
      await projectService.update(submitData);
      ElMessage.success("更新成功");
    }

    emit("updateList");
    closeDialog();
  } catch (error) {
    ElMessage.error(isCreate ? "添加失败" : "更新失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}
</style>
