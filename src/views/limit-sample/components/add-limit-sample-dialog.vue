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
        <el-card class="image-card">
          <div class="image-gallery">
            <div
              v-for="(image, index) in projectImages"
              :key="index"
              class="image-item"
            >
              <el-image
                :src="image"
                style="width: 80px; height: 80px"
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
        <div class="config-header mb-4">
          <div class="header-left">
            <h3>限度样条目配置</h3>
            <div v-if="itemList.length > 0" class="filter-controls">
              <div class="filter-item">
                <label class="filter-label">缺陷:</label>
                <el-select
                  v-model="flawFilter"
                  placeholder="全部缺陷"
                  clearable
                  filterable
                  size="small"
                  style="width: 150px"
                >
                  <el-option
                    v-for="flaw in flawList"
                    :key="flaw.id"
                    :label="flaw.name"
                    :value="flaw.id"
                  />
                </el-select>
              </div>

              <div class="filter-item">
                <label class="filter-label">位置:</label>
                <el-select
                  v-model="locationFilter"
                  placeholder="全部位置"
                  clearable
                  filterable
                  size="small"
                  style="width: 150px"
                >
                  <el-option
                    v-for="location in locationList"
                    :key="location.id"
                    :label="location.name"
                    :value="location.id"
                  />
                </el-select>
              </div>
            </div>
          </div>

          <el-button v-if="!isEdit" type="primary" @click="addItem">
            <el-icon><Plus /></el-icon>
            添加条目
          </el-button>
        </div>

        <!-- 过滤结果提示 -->
        <div
          v-if="itemList.length > 0 && (flawFilter || locationFilter)"
          class="filter-result mb-3"
        >
          <el-tag size="small" type="info">
            显示 {{ filteredItemList.length }} / {{ itemList.length }} 个条目
          </el-tag>
        </div>

        <div v-if="itemList.length > 0" class="item-cards">
          <el-card
            v-for="item in filteredItemList"
            :key="itemList.indexOf(item)"
            class="item-card"
            shadow="hover"
          >
            <template #header>
              <div class="card-header">
                <span>条目 {{ itemList.indexOf(item) + 1 }}</span>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  circle
                  @click="removeItem(item)"
                />
              </div>
            </template>

            <div class="card-content">
              <div class="form-item">
                <label class="form-label">关联缺陷</label>
                <el-select
                  v-model="item.flawId"
                  placeholder="请选择缺陷"
                  clearable
                  filterable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="flaw in getAvailableFlaws(item.flawId)"
                    :key="flaw.id"
                    :label="flaw.name"
                    :value="flaw.id"
                  />
                </el-select>
              </div>

              <div class="form-item">
                <label class="form-label">位置</label>
                <el-select
                  v-model="item.locationId"
                  placeholder="请选择位置"
                  clearable
                  filterable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="location in getAvailableLocations(item.locationId)"
                    :key="location.id"
                    :label="location.name"
                    :value="location.id"
                  />
                </el-select>
              </div>

              <div class="form-item">
                <label class="form-label">图片</label>
                <FileUpload
                  v-model="item.imageAddress"
                  :limit="1"
                  accept="image/*"
                  list-type="picture-card"
                />
              </div>

              <div class="form-item">
                <label class="form-label">备注</label>
                <el-input
                  v-model="item.remark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
                  size="small"
                />
              </div>
            </div>
          </el-card>
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
import { Plus, Delete } from "@element-plus/icons-vue";
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
const deletedItemIds = ref<number[]>([]);

// 过滤器状态
const flawFilter = ref<number | undefined>();
const locationFilter = ref<number | undefined>();

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
const removeItem = (item: LimitSampleItem) => {
  const index = itemList.value.indexOf(item);
  if (index > -1) {
    if (isEdit.value && item.id) {
      deletedItemIds.value.push(item.id);
    }
    itemList.value.splice(index, 1);
  }
};

// 过滤后的条目列表
const filteredItemList = computed(() => {
  let filtered = itemList.value;

  // 按缺陷过滤
  if (flawFilter.value) {
    filtered = filtered.filter(item => item.flawId === flawFilter.value);
  }

  // 按位置过滤
  if (locationFilter.value) {
    filtered = filtered.filter(
      item => item.locationId === locationFilter.value
    );
  }

  return filtered;
});

// 获取可用的缺陷列表
const getAvailableFlaws = (currentFlawId?: number) => {
  return flawList.value;
};

// 获取可用的位置列表
const getAvailableLocations = (currentLocationId?: number) => {
  return locationList.value;
};

// 重置表单
const resetForm = () => {
  projectForm.projectId = undefined;
  selectedProject.value = null;
  projectImages.value = [];
  flawList.value = [];
  locationList.value = [];
  itemList.value = [];
  deletedItemIds.value = [];
  flawFilter.value = undefined;
  locationFilter.value = undefined;
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
          imageAddress: item.imageAddress,
          remark: item.remark
        };
        return data;
      });
      await limitSampleService.add(promises);
      ElMessage.success(`添加成功`);
    } else {
      // 编辑模式 - 处理删除和更新
      const promises: Promise<any>[] = [];

      if (deletedItemIds.value.length > 0) {
        const deletePromises = deletedItemIds.value.map(id =>
          limitSampleService.delete(id)
        );
        promises.push(...deletePromises);
      }

      const updatePromises = itemList.value.map(item =>
        limitSampleService.update(item)
      );
      promises.push(...updatePromises);

      await Promise.all(promises);
      ElMessage.success(`编辑成功`);
    }

    emit("update-list");
    handleClose();
  } catch (error) {
    ElMessage.error(isEdit.value ? "编辑失败" : "添加失败");
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
.image-card {
  :deep {
    .el-card__body {
      padding: 0;
    }
  }
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header-left h3 {
  margin: 0;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.filter-result {
  text-align: center;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 0;
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

.item-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.item-card {
  width: calc(20% - 10px);
  min-width: 200px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #409eff;
  font-size: 13px;
}

.card-content {
  padding: 0;
}

.form-item {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
  font-weight: 500;
}

:deep(.el-upload--picture-card) {
  width: 60px;
  height: 60px;
  line-height: 60px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 60px;
  height: 60px;
}
</style>
