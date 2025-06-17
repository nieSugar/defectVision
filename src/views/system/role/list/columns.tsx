import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    { label: "角色名称", prop: "name" },
    { label: "权限字符", prop: "key" },
    { label: "状态", slot: "status" },
    { label: "创建时间", prop: "createTime" },
    { label: "操作", fixed: "right", width: 240, slot: "operation" }
  ]);

  return {
    columns
  };
}
