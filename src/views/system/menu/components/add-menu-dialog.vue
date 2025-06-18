<template>
  <el-dialog
    v-model="dialogTableVisible"
    :title="title"
    :width="600"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <el-tree-select
              v-model="formData.parentId"
              :data="menuOptions"
              :props="{
                value: 'id',
                label: 'name',
                children: 'children'
              }"
              value-key="id"
              clearable
              placeholder="选择上级菜单"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识" prop="perms">
            <el-input
              v-model="formData.perms"
              placeholder="请输入权限标识"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="rank">
            <el-input-number
              v-model="formData.rank"
              controls-position="right"
              :min="0"
            />
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
import menuService from "@/api/system/menu";
import { Menu } from "@/modules";
import { handleTree } from "@/utils/tree";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";

interface Props {
  visible: boolean;
  menuId?: number;
  isAddChild?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isAddChild: false
});

const emit = defineEmits(["update:visible", "updateList"]);

const title = ref("添加菜单");

const form = ref<FormInstance>();

const formData = ref<Menu>({
  name: "",
  perms: "",
  rank: 0
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  perms: [{ required: true, message: "权限标识不能为空", trigger: "blur" }]
});

const dialogTableVisible = ref(false);

const menuOptions = ref([]);

let isCreate = true;

function closeDialog() {
  dialogTableVisible.value = false;
}

async function confirmClick() {
  await form.value.validate(async valid => {
    if (!valid) {
      return;
    }
    if (isCreate) {
      await menuService.add({ ...formData.value });
    } else {
      await menuService.update({ ...formData.value });
    }
    ElMessage({
      message: isCreate ? "添加成功" : "修改成功",
      type: "success"
    });
    dialogTableVisible.value = false;
    emit("updateList");
  });
}

async function getMenuOptions() {
  const { data } = await menuService.getList({
    pageIndex: 1,
    pageSize: 10000
  });
  menuOptions.value = handleTree(data);
}

watch(
  () => dialogTableVisible.value,
  val => {
    emit("update:visible", val);
  }
);

onMounted(async () => {
  dialogTableVisible.value = props.visible;
  await getMenuOptions();
  if (props.isAddChild) {
    formData.value.parentId = props.menuId;
    return;
  }
  if (props.menuId) {
    const { data } = await menuService.get(props.menuId);
    if (data.parentId === 0) {
      data.parentId = undefined;
    }

    formData.value = { ...data };
    isCreate = false;
    title.value = "编辑菜单";
  }
});
</script>
