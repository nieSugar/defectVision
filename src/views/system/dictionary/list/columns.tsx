import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    { label: "名称", prop: "name" },
    { label: "默认值", prop: "value" },
    { label: "类别", prop: "category" },
    { label: "描述", prop: "description" },
    { label: "创建时间", prop: "createTime" },
    { label: "操作", fixed: "right", width: 120, slot: "operation" }
  ]);

  return {
    columns
  };
}
