<template>
  <el-dialog
    v-model="dialogTableVisible"
    :title="title"
    :width="480"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="权限字符" prop="key">
        <el-input v-model="formData.key" placeholder="请输入权限字符" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in stateOptions"
            :key="dict.value.toString()"
            :label="dict.value"
            >{{ dict.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否为管理员">
        <el-radio-group v-model="formData.manager">
          <el-radio :label="true" size="large">是</el-radio>
          <el-radio :label="false" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand">
          展开/折叠
        </el-checkbox>
        <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll">
          全选/全不选
        </el-checkbox>
        <el-tree
          ref="menuRef"
          class="tree-border"
          :data="menuOptions"
          show-checkbox
          node-key="id"
          empty-text="暂无数据"
          :props="{ label: 'name', children: 'children' }"
          @check="handleTreeCheck"
        />
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
import menuService from "@/api/system/menu";
import roleService from "@/api/user/role";
import { Menu, Role } from "@/modules";
import { handleTree } from "@/utils/tree";
import { ElMessage, ElTree, FormInstance, FormRules } from "element-plus";
import { nextTick, onMounted, reactive, ref, watch } from "vue";

interface Props {
  visible: boolean;
  role?: Role;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
});

const emit = defineEmits(["update:visible", "updateList"]);

const title = ref("添加角色");

let isCreate = true;

const form = ref<FormInstance>();

const formData = reactive<Role>({
  status: true,
  description: "",
  manager: false
});

const menuRef = ref<InstanceType<typeof ElTree>>();

const menuExpand = ref(false);
const menuNodeAll = ref(false);

const menuOptions = ref<Array<Menu>>([]);

const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  key: [{ required: true, message: "请输入权限字符", trigger: "blur" }]
});

const dialogTableVisible = ref(false);

const stateOptions = ref([
  { label: "启用", value: true },
  { label: "禁用", value: false }
]);

function handleCheckedTreeExpand(value: boolean) {
  for (const nodeId in menuRef.value.store.nodesMap) {
    menuRef.value.store.nodesMap[nodeId].expanded = value;
  }
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value: boolean) {
  menuRef.value.setCheckedKeys(value ? getAllMenuIds() : []);
}

/** 获取所有菜单ID */
function getAllMenuIds(): number[] {
  const getAllIds = (menus: Menu[]): number[] => {
    let ids: number[] = [];
    menus.forEach(menu => {
      ids.push(menu.id);
      if (menu.children && menu.children.length > 0) {
        ids = ids.concat(getAllIds(menu.children));
      }
    });
    return ids;
  };
  return getAllIds(menuOptions.value);
}

function handleTreeCheck() {
  const checkedKeys = menuRef.value.getCheckedKeys();
  const allMenuIds = getAllMenuIds();
  menuNodeAll.value =
    allMenuIds.length > 0 && allMenuIds.every(id => checkedKeys.includes(id));
}

function closeDialog() {
  dialogTableVisible.value = false;
}

async function confirmClick() {
  await form.value.validate(async valid => {
    if (!valid) {
      return;
    }
    const selectMenuIds = (menuRef.value.getCheckedKeys() ??
      []) as Array<number>;
    if (isCreate) {
      await roleService.add({
        ...formData,
        permissions: selectMenuIds
      });
    } else {
      await roleService.update({
        ...formData,
        permissions: selectMenuIds
      });
    }
    ElMessage({
      message: isCreate ? "添加成功" : "编辑成功",
      type: "success"
    });
    dialogTableVisible.value = false;
    emit("updateList");
  });
}

async function getMenuOptions() {
  const result = await menuService.getList({
    name: "",
    pageIndex: 1,
    pageSize: 10000
  });
  menuOptions.value = handleTree(result.data);
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
  if (props.role) {
    title.value = "编辑角色";
    formData.id = props.role.id;
    formData.name = props.role.name;
    formData.key = props.role.key;
    formData.status = props.role.status;
    formData.manager = props.role.manager;
    formData.description = props.role.description;
    // tree 组件选择role的permissions
    nextTick(() => {
      menuRef.value.setCheckedKeys(props.role.permissions);
      handleTreeCheck();
    });
    isCreate = false;
  } else {
    title.value = "添加角色";
  }
});
</script>
<style scoped lang="scss">
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
  width: 100%;
}
</style>
