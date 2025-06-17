<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="480"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="地址URL" prop="addressUrl">
        <el-input v-model="formData.addressUrl" placeholder="请输入地址URL" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="formData.describe"
          type="textarea"
          placeholder="请输入描述"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="closeDialog()">关闭</el-button>
        <el-button type="primary" @click="confirmClick()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PortalSystem } from "@/modules";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import portalSystemService from "@/api/system/portal-system";

interface Props {
  portalSystem?: PortalSystem;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["update:visible", "updateList"]);

const title = ref("添加门户系统");

let isCreate = true;

const form = ref<FormInstance>();

const formData = reactive<PortalSystem>({
  name: "",
  addressUrl: "",
  describe: ""
});

const visible = defineModel({ type: Boolean });

const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  addressUrl: [{ required: true, message: "请输入地址URL", trigger: "blur" }]
});

function closeDialog() {
  visible.value = false;
}

async function confirmClick() {
  await form.value.validate(async valid => {
    if (!valid) {
      return;
    }
    if (isCreate) {
      await portalSystemService.add({ ...formData });
    } else {
      await portalSystemService.update({ ...formData });
    }
    ElMessage({
      message: isCreate ? "添加成功" : "编辑成功",
      type: "success"
    });
    visible.value = false;
    emit("updateList");
  });
}

onMounted(async () => {
  if (props.portalSystem) {
    title.value = "编辑门户系统";
    formData.id = props.portalSystem.id;
    formData.name = props.portalSystem.name;
    formData.addressUrl = props.portalSystem.addressUrl;
    formData.describe = props.portalSystem.describe;
    isCreate = false;
  } else {
    title.value = "添加门户系统";
  }
});
</script>

<style scoped></style>
