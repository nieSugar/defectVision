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
      <el-form-item label="默认值" prop="value">
        <el-input v-model="formData.value" placeholder="请输入默认值" />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input v-model="formData.category" placeholder="请输入类别" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="formData.description"
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
import { Dictionary } from "@/modules";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import dictionaryService from "@/api/user/dictionary";
interface Props {
  dictionary?: Dictionary;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["update:visible", "updateList"]);

const title = ref("添加字典");

let isCreate = true;

const form = ref<FormInstance>();

const formData = reactive<Dictionary>({
  name: "",
  value: "",
  category: "",
  description: ""
});

const visible = defineModel({ type: Boolean });

const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入默认值", trigger: "blur" }],
  category: [{ required: true, message: "请输入类别", trigger: "blur" }]
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
      await dictionaryService.add({ ...formData });
    } else {
      await dictionaryService.update({ ...formData });
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
  if (props.dictionary) {
    title.value = "编辑配置";
    formData.id = props.dictionary.id;
    formData.name = props.dictionary.name;
    formData.value = props.dictionary.value;
    formData.category = props.dictionary.category;
    formData.description = props.dictionary.description;
    isCreate = false;
  } else {
    title.value = "添加配置";
  }
});
</script>
<style scoped lang="scss">
.tree-border {
  width: 100%;
  margin-top: 5px;
  border: 1px solid var(--el-border-color-hover);
  border-radius: 4px;
}
</style>
