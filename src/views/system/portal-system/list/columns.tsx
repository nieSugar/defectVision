import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    { label: "名称", prop: "name" },
    { label: "地址URL", prop: "addressUrl" },
    { label: "描述", prop: "describe" },
    { label: "创建时间", prop: "createTime" },
    { label: "操作", fixed: "right", width: 120, slot: "operation" }
  ]);

  return {
    columns
  };
}
