<template>
  <el-dialog
    v-model="dialogTableVisible"
    :title="title"
    :width="600"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input
              v-model="formData.nickName"
              placeholder="请输入用户昵称"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              :data="deptOptions"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              value-key="id"
              placeholder="请选择归属部门"
              check-strictly
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="formData.phoneNumber"
              placeholder="请输入手机号码"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="formData.userName"
              placeholder="请输入用户名"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isCreate" :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input
              v-model="formData.password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="20"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="dict in stateOptions"
                :key="dict.value.toString()"
                :value="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="formData.roleIds" multiple placeholder="请选择">
              <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="formData.description"
              type="textarea"
              placeholder="请输入内容"
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
import userService from "@/api/user/user";
import deptService from "@/api/user/dept";
import roleService from "@/api/user/role";
import { Role, User } from "@/modules";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { handleTree } from "@/utils/tree";

interface Props {
  visible: boolean;
  userId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
});

const emit = defineEmits(["update:visible", "updateList"]);

const title = ref("添加用户");

const form = ref<FormInstance>();

const formData = ref<User>({
  nickName: "",
  userName: "",
  password: "",
  email: "",
  status: true,
  phoneNumber: "",
  description: ""
});

const rules = reactive<FormRules>({
  userName: [
    { required: true, message: "请输入名称", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "用户名称长度必须介于 2 和 20 之间",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z0-9_]{2,20}$/,
      message: "用户名称只能包含字母、数字和下划线"
    }
  ],
  nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 5,
      max: 20,
      message: "用户密码长度必须介于 5 和 20 之间",
      trigger: "blur"
    }
  ],
  phonenumber: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  email: [
    {
      pattern: /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }
  ]
});

const dialogTableVisible = ref(false);

const deptOptions = ref([]);

const stateOptions = ref([
  { label: "启用", value: true },
  { label: "禁用", value: false }
]);

const roleOptions = ref<Array<Role>>([]);

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
      await userService.add(formData.value);
    } else {
      await userService.update(formData.value);
    }
    ElMessage({
      message: isCreate ? "添加成功" : "修改成功",
      type: "success"
    });
    dialogTableVisible.value = false;
    emit("updateList");
  });
}

async function getDeptOptions() {
  const { data } = await deptService.getList({
    pageIndex: 1,
    pageSize: 1000
  });
  deptOptions.value = handleTree(data);
}

async function getRoleOptions() {
  const { data } = await roleService.getList({
    pageIndex: 1,
    pageSize: 1000
  });
  roleOptions.value = data;
}

watch(
  () => dialogTableVisible.value,
  val => {
    emit("update:visible", val);
  }
);

onMounted(async () => {
  dialogTableVisible.value = props.visible;
  if (props.userId) {
    // 调用接口获取用户信息 将用户信息赋值给formData
    const user = await userService.get(props.userId);
    formData.value = { ...formData.value, ...user.data };
    isCreate = false;
    title.value = "编辑用户";
  }
  await getDeptOptions();
  await getRoleOptions();
});
</script>
