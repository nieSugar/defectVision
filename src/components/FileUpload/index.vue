<template>
  <div class="file-upload">
    <el-upload
      v-if="listType === 'picture-card'"
      ref="uploadRef"
      :action="uploadUrl"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :file-list="fileList"
      :auto-upload="true"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :http-request="customUpload"
      list-type="picture-card"
    >
      <template #file="{ file }">
        <div class="upload-picture-card-item">
          <el-image
            style="width: 100%; height: 100%"
            :src="file.url"
            :preview-src-list="previewUrls"
            fit="cover"
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click.stop="previewImage(file)"
            >
              <el-icon><ZoomIn /></el-icon>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click.stop="removeFile(file)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-upload
      v-else
      ref="uploadRef"
      :action="uploadUrl"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :file-list="fileList"
      :auto-upload="true"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :http-request="customUpload"
    >
      <template #trigger>
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          {{ buttonText }}
        </el-button>
      </template>
      <template #tip>
        <div v-if="tip" class="el-upload__tip">
          {{ tip }}
        </div>
      </template>
    </el-upload>
  </div>
  <el-image-viewer
    v-if="viewerVisible"
    :url-list="previewUrls"
    :initial-index="viewerIndex"
    @close="viewerVisible = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  ElMessage,
  type UploadFile,
  type UploadFiles,
  type UploadRequestOptions
} from "element-plus";
import { Plus, Upload, Delete, ZoomIn } from "@element-plus/icons-vue";
import { fileService } from "@/api/oss";

interface Props {
  modelValue?: string | string[];
  multiple?: boolean;
  limit?: number;
  accept?: string;
  listType?: "text" | "picture" | "picture-card";
  buttonText?: string;
  tip?: string;
  maxSize?: number; // MB
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  multiple: false,
  limit: 1,
  accept: "*",
  listType: "text",
  buttonText: "选择文件",
  tip: "",
  maxSize: 10
});

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]];
  change: [value: string | string[]];
}>();

const uploadRef = ref();
const fileList = ref<UploadFiles>([]);
const uploadUrl = "/api/file/InsertFile";

// 初始化文件列表
const initFileList = () => {
  if (props.modelValue) {
    if (Array.isArray(props.modelValue)) {
      fileList.value = props.modelValue.map((url, index) => ({
        name: `file-${index}`,
        url: url,
        uid: Date.now() + index,
        status: "success"
      }));
    } else if (props.modelValue) {
      fileList.value = [
        {
          name: "file",
          url: props.modelValue,
          uid: Date.now(),
          status: "success"
        }
      ];
    }
  } else {
    fileList.value = [];
  }
};

// 监听modelValue变化
watch(
  () => props.modelValue,
  () => {
    initFileList();
  },
  { immediate: true }
);

// 预览地址列表供 Image 使用
const previewUrls = computed(() =>
  fileList.value.filter(f => f.status === "success" && f.url).map(f => f.url!)
);

// 查看大图
const viewerVisible = ref(false);
const viewerIndex = ref(0);

const previewImage = (file: UploadFile) => {
  const idx = previewUrls.value.findIndex(u => u === file.url);
  viewerIndex.value = idx === -1 ? 0 : idx;
  viewerVisible.value = true;
};

// 文件变化处理
const handleChange = (file: UploadFile, files: UploadFiles) => {
  // 文件状态变化时更新文件列表
  fileList.value = files;
};

// 点击删除按钮
const removeFile = (file: UploadFile) => {
  uploadRef.value?.handleRemove(file);
};

// 文件移除处理
const handleRemove = (file: UploadFile) => {
  const urls = fileList.value
    .filter(f => f.uid !== file.uid && f.status === "success" && f.url)
    .map(f => f.url!);

  updateValue(urls);
};

// 文件超出限制处理
const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`);
};

// 上传前检查
const beforeUpload = (file: File) => {
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize;
  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`);
    return false;
  }
  return true;
};

// 自定义上传
const customUpload = async (options: UploadRequestOptions) => {
  try {
    // 确保options.file是正确的File对象
    if (!options.file) {
      ElMessage.error("文件对象为空");
      return;
    }

    const result = await fileService.upload(options.file);

    if (result && result.length > 0) {
      const fileUrl = result[0].filePath;
      console.log("获取到文件URL:", fileUrl);

      // 更新文件状态
      const fileIndex = fileList.value.findIndex(
        f => f.uid === options.file.uid
      );
      if (fileIndex !== -1) {
        fileList.value[fileIndex].status = "success";
        fileList.value[fileIndex].url = fileUrl;
      }

      // 更新值
      const urls = fileList.value
        .filter(f => f.status === "success" && f.url)
        .map(f => f.url!);

      updateValue(urls);

      ElMessage.success("上传成功");
    } else {
      ElMessage.warning("上传成功但未获取到文件路径");
    }
  } catch (error) {
    console.error("文件上传失败:", error);
    ElMessage.error("上传失败");
    // 移除失败的文件
    const fileIndex = fileList.value.findIndex(f => f.uid === options.file.uid);
    if (fileIndex !== -1) {
      fileList.value.splice(fileIndex, 1);
    }
  }
};

// 更新值
const updateValue = (urls: string[]) => {
  const value = props.multiple ? urls : urls[0] || "";
  emit("update:modelValue", value);
  emit("change", value);
};

// 手动上传
const submit = () => {
  uploadRef.value?.submit();
};

// 清空文件
const clearFiles = () => {
  uploadRef.value?.clearFiles();
  fileList.value = [];
  updateValue([]);
};

defineExpose({
  submit,
  clearFiles
});
</script>

<style scoped>
.file-upload {
  width: 100%;
}
</style>
