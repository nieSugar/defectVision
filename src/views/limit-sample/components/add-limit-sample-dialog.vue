<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑限度样' : '添加限度样'"
    width="1200px"
    top="2%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-content">
      <el-form
        ref="projectFormRef"
        :model="projectForm"
        :rules="projectRules"
        label-width="100px"
        class="mb-6"
      >
        <el-form-item label="关联项目" prop="projectId">
          <el-select
            v-model="projectForm.projectId"
            placeholder="请选择关联项目"
            clearable
            filterable
            style="width: 100%"
            @change="onProjectChange"
          >
            <el-option
              v-for="project in projectList"
              :key="project.id"
              :label="project.name"
              :value="project.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 项目图片展示 -->
      <div v-if="projectImages.length > 0" class="project-images mb-6">
        <el-card>
          <div class="image-gallery">
            <div
              v-for="(image, index) in projectImages"
              :key="index"
              class="image-item"
            >
              <el-image
                :src="image"
                style="width: 120px; height: 120px; margin: 5px"
                fit="cover"
                :preview-src-list="projectImages"
                :initial-index="index"
              />
            </div>
          </div>
        </el-card>
      </div>

      <!-- 限度样条目配置 -->
      <div v-if="projectForm.projectId">
        <div class="flex justify-between items-center mb-4">
          <h3>限度样条目配置</h3>
          <el-button v-if="!isEdit" type="primary" @click="addItem">
            <el-icon><Plus /></el-icon>
            添加条目
          </el-button>
        </div>

        <div v-if="itemList.length > 0">
          <el-table :data="itemList" border style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
            />

            <el-table-column label="关联缺陷" min-width="150">
              <template #default="{ row }">
                <el-select
                  v-model="row.flawId"
                  placeholder="请选择缺陷"
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="flaw in flawList"
                    :key="flaw.id"
                    :label="flaw.name"
                    :value="flaw.id"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="位置" min-width="150">
              <template #default="{ row }">
                <el-select
                  v-model="row.locationId"
                  placeholder="请选择位置"
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="location in locationList"
                    :key="location.id"
                    :label="location.name"
                    :value="location.id"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="图片" min-width="200">
              <template #default="{ row }">
                <div class="flex justify-center">
                  <FileUpload
                    v-model="row.imageAddress"
                    :limit="1"
                    accept="image/*"
                    list-type="picture-card"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="150">
              <template #default="{ row }">
                <el-input v-model="row.remark" placeholder="请输入备注" />
              </template>
            </el-table-column>

            <el-table-column label="操作" width="80" align="center">
              <template #default="{ $index }">
                <el-button
                  type="danger"
                  size="small"
                  @click="removeItem($index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else class="no-items">
          <el-empty description="暂无条目，请点击添加条目按钮">
            <el-button v-if="!isEdit" type="primary" @click="addItem">
              添加条目
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!projectForm.projectId"
          @click="handleSubmit"
        >
          {{ isEdit ? "更新" : "添加" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { limitSampleService, projectService, flawService } from "@/api/project";
import locationService from "@/api/system/location";
import type { Project, Flaw, Location, LimitSampleItem } from "@/modules";
import FileUpload from "@/components/FileUpload/index.vue";

interface Props {
  modelValue: boolean;
  verionId?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "update-list": [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value)
});

const isEdit = computed(() => !!props.verionId);

// 表单引用
const projectFormRef = ref<FormInstance>();
const loading = ref(false);

// 数据列表
const projectList = ref<Project[]>([]);
const flawList = ref<Flaw[]>([]);
const locationList = ref<Location[]>([]);
const selectedProject = ref<Project | null>(null);
const projectImages = ref<string[]>([]);

// 项目选择表单
const projectForm = reactive({
  projectId: undefined as number | undefined
});

const itemList = ref<LimitSampleItem[]>([]);

// 表单验证规则
const projectRules = {
  projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }]
};

// 加载项目列表
const loadProjectList = async () => {
  try {
    const result = await projectService.getList({
      pageIndex: 1,
      pageSize: 1000
    });
    if (result.data) {
      projectList.value = result.data;
    }
  } catch (error) {
    ElMessage.error("获取项目列表失败");
  }
};

// 项目变化时加载相关数据
const onProjectChange = async (projectId: number) => {
  if (!projectId) {
    flawList.value = [];
    locationList.value = [];
    selectedProject.value = null;
    projectImages.value = [];
    return;
  }

  // 设置选中的项目
  selectedProject.value =
    projectList.value.find(p => p.id === projectId) || null;

  try {
    // 加载缺陷列表
    const flawResult = await flawService.getList({
      pageIndex: 1,
      pageSize: 1000,
      projectId
    });
    if (flawResult.data) {
      flawList.value = flawResult.data;
    }

    // 加载位置列表
    const locationResult = await locationService.getList({
      pageIndex: 1,
      pageSize: 1000,
      projectId
    });
    if (locationResult.data) {
      locationList.value = locationResult.data;
    }

    // 加载项目图片
    if (selectedProject.value?.images) {
      projectImages.value = selectedProject.value.images;
    } else {
      projectImages.value = [];
    }
  } catch (error) {
    ElMessage.error("获取项目相关数据失败");
  }
};

// 添加条目
const addItem = () => {
  itemList.value.push({
    flawId: undefined,
    locationId: undefined,
    imageAddress: ""
  });
};

// 删除条目
const removeItem = (index: number) => {
  itemList.value.splice(index, 1);
};

// 重置表单
const resetForm = () => {
  projectForm.projectId = undefined;
  selectedProject.value = null;
  projectImages.value = [];
  flawList.value = [];
  locationList.value = [];
  itemList.value = [];
  projectFormRef.value?.clearValidate();
};

// 关闭对话框
const handleClose = () => {
  resetForm();
  visible.value = false;
};

// 提交表单
const handleSubmit = async () => {
  // 验证是否有条目
  if (itemList.value.length === 0) {
    ElMessage.warning("请至少添加一个条目");
    return;
  }

  // 验证每个条目的必填项
  for (let i = 0; i < itemList.value.length; i++) {
    const item = itemList.value[i];
    if (!item.flawId) {
      ElMessage.warning(`条目 ${i + 1} 请选择缺陷`);
      return;
    }
    if (!item.locationId) {
      ElMessage.warning(`条目 ${i + 1} 请选择位置`);
      return;
    }
    if (!item.imageAddress) {
      ElMessage.warning(`条目 ${i + 1} 请上传图片`);
      return;
    }
  }

  try {
    loading.value = true;
    if (!isEdit.value) {
      const promises = itemList.value.map(item => {
        const data: LimitSampleItem = {
          projectId: projectForm.projectId!,
          flawId: item.flawId!,
          locationId: item.locationId,
          imageAddress: item.imageAddress
        };
        return data;
      });
      await limitSampleService.add(promises);
      ElMessage.success(`添加成功`);
    } else {
      const promises = itemList.value.map(item => {
        return limitSampleService.update(item);
      });
      await Promise.all(promises);
      ElMessage.success(`编辑成功`);
    }

    emit("update-list");
    handleClose();
  } catch (error) {
    ElMessage.error("添加失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProjectList();
  if (props.verionId) {
    limitSampleService.getListByVerionId(props.verionId).then(result => {
      if (result.data) {
        projectForm.projectId = result.data[0].projectId;
        onProjectChange(projectForm.projectId!);
        itemList.value = result.data;
      }
    });
  }
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.dialog-content {
  max-height: 80vh;
  overflow-y: auto;
}

.project-images {
  margin-bottom: 24px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 0;
}

.image-item {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.no-items {
  text-align: center;
  padding: 40px 0;
}

.card-header {
  font-weight: 600;
  color: #409eff;
}

:deep(.el-table .el-upload--picture-card) {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

:deep(.el-table .el-upload-list--picture-card .el-upload-list__item) {
  width: 80px;
  height: 80px;
}
</style>
