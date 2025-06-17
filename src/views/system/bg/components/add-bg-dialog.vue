<template>
  <el-dialog
    v-model="dialogTableVisible"
    :title="title"
    :width="450"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="60px"
      :inline="false"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="位置" prop="code">
            <el-input v-model="formData.code" placeholder="请输入位置" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formData.describe"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import bgService from "@/api/system/bg";
import { BGManager } from "@/modules";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";

interface Props {
  visible: boolean;
  bgId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
});

const emit = defineEmits(["update:visible", "updateList"]);

const title = ref("添加BG");

const form = ref<FormInstance>();

const formData = ref<BGManager>({
  name: "",
  code: "",
  describe: ""
});

let isCreate = true;

const rules = reactive<FormRules>({
  name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  code: [{ required: true, message: "位置不能为空", trigger: "blur" }]
});

const dialogTableVisible = ref(false);

watch(
  () => props.visible,
  val => {
    dialogTableVisible.value = val;
  }
);

watch(
  () => dialogTableVisible.value,
  val => {
    emit("update:visible", val);
  }
);

function closeDialog() {
  dialogTableVisible.value = false;
  form.value?.resetFields();
  formData.value = {
    name: "",
    code: "",
    describe: ""
  };
}

async function handleSubmit() {
  const valid = await form.value?.validate();
  if (valid) {
    try {
      if (isCreate) {
        await bgService.add(formData.value);
        ElMessage.success("添加成功");
      } else {
        await bgService.update(formData.value);
        ElMessage.success("修改成功");
      }
      emit("updateList");
      closeDialog();
    } catch (error) {
      ElMessage.error(isCreate ? "添加失败" : "修改失败");
    }
  }
}

onMounted(async () => {
  dialogTableVisible.value = props.visible;
  if (props.bgId) {
    const { data } = await bgService.get(props.bgId);
    formData.value = { ...data };
    isCreate = false;
    title.value = "编辑BG";
  }
});
</script>

<style lang="scss" scoped>
.tree-select {
  width: 100%;
}
</style>
