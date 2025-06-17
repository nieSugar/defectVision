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
      label-width="120px"
      :inline="false"
    >
      <el-row>
        <el-col v-if="formData.parentId !== 0" :span="24">
          <el-form-item label="上级部门" prop="parentId">
            <el-tree-select
              v-model="formData.parentId"
              :data="deptOptions"
              :render-after-expand="false"
              :props="{
                value: 'id',
                label: 'name',
                children: 'children'
              }"
              value-key="id"
              placeholder="选择上级部门"
              check-strictly
              class="tree-select"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="部门状态">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="dict in deptStatusOptions"
                :key="dict.value.toString()"
                :label="dict.value"
                >{{ dict.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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
import deptService from "@/api/user/dept";
import { Dept } from "@/modules";
import { handleTree } from "@/utils/tree";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";

interface Props {
  visible: boolean;
  parentId?: number;
  deptId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
});

const emit = defineEmits(["update:visible", "updateList"]);

const title = ref("添加部门");

const form = ref<FormInstance>();

const formData = ref<Dept>({ name: "", status: true });

let isCreate = true;

const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }]
});

const dialogTableVisible = ref(false);

const deptOptions = ref([]);

const deptStatusOptions = ref([
  { label: "正常", value: true },
  { label: "停用", value: false }
]);

function closeDialog() {
  dialogTableVisible.value = false;
}

async function confirmClick() {
  await form.value.validate(async valid => {
    if (!valid) {
      return;
    }
    if (isCreate) {
      await deptService.add(formData.value);
    } else {
      await deptService.update(formData.value);
    }
    ElMessage({
      message: "添加成功",
      type: "success"
    });
    dialogTableVisible.value = false;
    emit("updateList");
  });
}

async function getDeptOptions() {
  const { data } = await deptService.getList({ query: { name: "" } });
  deptOptions.value = handleTree(data);
}

watch(
  () => dialogTableVisible.value,
  val => {
    emit("update:visible", val);
  }
);

onMounted(async () => {
  dialogTableVisible.value = props.visible;
  await getDeptOptions();
  if (props.parentId) {
    formData.value.parentId = props.parentId;
  }
  if (props.deptId) {
    title.value = "编辑部门";
    const { data } = await deptService.get(props.deptId);
    formData.value = data as Dept;
    isCreate = false;
  }
});
</script>
<style lang="scss" scoped>
.tree-select {
  width: 100%;
}
</style>
