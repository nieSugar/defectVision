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
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="formData.type">
              <el-radio :value="1">目录</el-radio>
              <el-radio :value="2">菜单</el-radio>
              <el-radio :value="3">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type !== 3" :span="24">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              v-model:visible="showChooseIcon"
              placement="bottom-start"
              :width="540"
              trigger="click"
              @show="showSelectIcon"
            >
              <template #reference>
                <el-input
                  v-model="formData.icon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <template #prefix>
                    <IconifyIconOffline
                      v-if="formData.icon"
                      :icon="formData.icon"
                    />
                    <IconifyIconOffline v-else icon="search" />
                  </template>
                </el-input>
              </template>
              <icon-select ref="iconSelectRef" @selected="selected" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type !== 3" :span="12">
          <el-form-item label="显示排序" prop="rank">
            <el-input-number
              v-model="formData.rank"
              controls-position="right"
              :min="0"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type !== 3" :span="12">
          <el-form-item>
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" /> </el-tooltip
                >是否外链
              </span>
            </template>
            <el-radio-group v-model="formData.isFrame">
              <el-radio :value="1">是</el-radio>
              <el-radio :value="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type !== 3 && formData.isFrame === 1" :span="12">
          <el-form-item>
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="选择是外链内嵌则在系统内窗口打开，否则在新窗口打开"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" /> </el-tooltip
                >是否内嵌
              </span>
            </template>
            <el-radio-group v-model="formData.isEmbedded">
              <el-radio :value="1">是</el-radio>
              <el-radio :value="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type !== 3" :span="12">
          <el-form-item prop="path">
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="访问的路由地址，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" />
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="formData.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="formData.type === 2">
          <el-form-item prop="component">
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" />
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input
              v-model="formData.component"
              placeholder="请输入组件路径"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item prop="perms">
            <el-input
              v-model="formData.perms"
              placeholder="请输入权限标识"
              maxlength="100"
            />
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="控制器中定义的权限字符，如：system.menu)"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" />
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="formData.type == '2'">
          <el-form-item>
            <el-input
              v-model="formData.query"
              placeholder="请输入路由参数"
              maxlength="255"
            />
            <template #label>
              <span  class="icon-label">
                <el-tooltip
                  content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" />
                </el-tooltip>
                路由参数
              </span>
            </template>
          </el-form-item>
        </el-col> -->
        <el-col v-if="formData.type === 2" :span="12">
          <el-form-item>
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" />
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="formData.isCache">
              <el-radio :value="1">缓存</el-radio>
              <el-radio :value="2">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type !== 3" :span="12">
          <el-form-item>
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" />
                </el-tooltip>
                显示状态
              </span>
            </template>
            <el-radio-group v-model="formData.visible">
              <el-radio
                v-for="dict in visibleOptions"
                :key="dict.value"
                :value="dict.value"
                >{{ dict.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type !== 3" :span="12">
          <el-form-item>
            <template #label>
              <span class="icon-label">
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <IconifyIconOffline icon="question-filled" />
                </el-tooltip>
                菜单状态
              </span>
            </template>
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="dict in stateOptions"
                :key="dict.value"
                :value="dict.value"
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
import menuService from "@/api/system/menu";
import { Menu } from "@/modules";
import { handleTree } from "@/utils/tree";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import IconSelect from "@/components/IconSelected/index.vue";

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
const showChooseIcon = ref(false);

const formData = ref<Menu>({
  status: 1,
  visible: 1,
  type: 1,
  isFrame: 2,
  isEmbedded: 2,
  isCache: 1,
  icon: "",
  frameSrc: "",
  perms: "",
  path: ""
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }],
  perms: [{ required: true, message: "权限字符不能为空", trigger: "blur" }]
});

const dialogTableVisible = ref(false);

const iconSelectRef = ref(null);

const stateOptions = ref([
  { label: "启用", value: 1 },
  { label: "禁用", value: 2 }
]);

const visibleOptions = ref([
  { label: "显示", value: 1 },
  { label: "隐藏", value: 2 }
]);

const menuOptions = ref([]);

let isCreate = true;

/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
  showChooseIcon.value = true;
}

function closeDialog() {
  dialogTableVisible.value = false;
}

function selected(name: string) {
  formData.value.icon = name;
  showChooseIcon.value = false;
}

// function hideSelectIcon(event) {
//   const elem =
//     event.relatedTarget ||
//     event.srcElement ||
//     event.target ||
//     event.currentTarget;
//   const className = elem.className;
//   if (className !== 'el-input__inner') {
//     showChooseIcon.value = false;
//   }
// }

async function confirmClick() {
  await form.value.validate(async valid => {
    if (!valid) {
      return;
    }
    if (isCreate) {
      await menuService.add(formData.value);
    } else {
      await menuService.update(formData.value);
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
    const { data } = await menuService.get(props.menuId);
    if (data.type === 1) {
      // 目录的话则添加为菜单
      formData.value.type = 2;
    } else if (data.type === 2) {
      // 菜单的话则添加为按钮
      formData.value.type = 3;
    }
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
<style lang="scss" scoped>
.icon-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: color 0.3s;
}
</style>
