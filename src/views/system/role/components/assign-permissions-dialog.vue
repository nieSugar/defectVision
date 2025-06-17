<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="分配菜单权限"
    width="600px"
    draggable
    :before-close="closeDialog"
  >
    <el-form
      ref="form"
      :model="formData"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="角色名称">
        <el-input v-model="formData.name" disabled />
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
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="confirmClick">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch, nextTick } from "vue";
import { ElMessage, ElTree, FormInstance } from "element-plus";
import { Role, Menu } from "@/modules";
import roleService from "@/api/user/role";
import menuService from "@/api/system/menu";
import { handleTree } from "@/utils/tree";

interface Props {
  visible: boolean;
  role?: Role;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  role: undefined
});

const emit = defineEmits(["update:visible", "updateList"]);

const form = ref<FormInstance>();
const menuRef = ref<InstanceType<typeof ElTree>>();

const formData = reactive<Role>({
  name: "",
  key: "",
  status: true,
  description: "",
  manager: false
});

const menuExpand = ref(false);
const menuNodeAll = ref(false);
const menuOptions = ref<Array<Menu>>([]);
const dialogTableVisible = ref(false);

// 获取所有菜单ID
function getAllMenuIds(): Array<number> {
  const ids: Array<number> = [];
  function traverse(menus: Array<Menu>) {
    menus.forEach(menu => {
      if (menu.id) {
        ids.push(menu.id);
      }
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children);
      }
    });
  }
  traverse(menuOptions.value);
  return ids;
}

// 展开/折叠树
function handleCheckedTreeExpand() {
  const nodes = menuRef.value?.store.nodesMap;
  if (nodes) {
    for (const node in nodes) {
      nodes[node].expanded = menuExpand.value;
    }
  }
}

// 全选/全不选
function handleCheckedTreeNodeAll() {
  const allMenuIds = getAllMenuIds();
  if (menuNodeAll.value) {
    menuRef.value?.setCheckedKeys(allMenuIds);
  } else {
    menuRef.value?.setCheckedKeys([]);
  }
}

// 树节点选择变化
function handleTreeCheck() {
  const checkedKeys = menuRef.value?.getCheckedKeys() || [];
  const allMenuIds = getAllMenuIds();
  menuNodeAll.value =
    allMenuIds.length > 0 && allMenuIds.every(id => checkedKeys.includes(id));
}

// 关闭弹框
function closeDialog() {
  dialogTableVisible.value = false;
}

// 确认分配权限
async function confirmClick() {
  if (!props.role?.id) {
    ElMessage.error("角色信息不完整");
    return;
  }

  const selectMenuIds = (menuRef.value?.getCheckedKeys() ||
    []) as Array<number>;
  try {
    await roleService.assignPermissions(props.role.id, selectMenuIds);
    ElMessage.success("权限分配成功");
    dialogTableVisible.value = false;
    emit("updateList");
  } catch (error) {
    ElMessage.error("权限分配失败");
  }
}

// 加载菜单数据
async function loadMenuData() {
  try {
    const result = await menuService.getList({
      pageIndex: 1,
      pageSize: 1000 // 获取所有菜单
    });
    menuOptions.value = handleTree(result.data);
  } catch (error) {
    ElMessage.error("加载菜单数据失败");
  }
}

// 加载角色已有权限
async function loadRolePermissions() {
  if (props.role?.id) {
    try {
      const roleData = await roleService.get(props.role.id);
      if (roleData.data?.permissions) {
        await nextTick();
        menuRef.value?.setCheckedKeys(roleData.data.permissions);
        handleTreeCheck();
      }
    } catch (error) {
      console.error("加载角色权限失败:", error);
    }
  }
}

// 监听visible变化
watch(
  () => props.visible,
  async newVal => {
    dialogTableVisible.value = newVal;
    if (newVal) {
      // 重置表单数据
      if (props.role) {
        Object.assign(formData, props.role);
      }

      // 加载菜单数据
      await loadMenuData();

      // 加载角色已有权限
      await loadRolePermissions();
    }
  },
  { immediate: true }
);

// 监听dialogTableVisible变化，同步到父组件
watch(dialogTableVisible, newVal => {
  emit("update:visible", newVal);
});
</script>

<style scoped>
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}
</style>
