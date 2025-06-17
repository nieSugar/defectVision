import { ref } from "vue";

export function useColumns() {
  const columns = ref<TableColumnList>([
    { label: "系统模块", prop: "title" },
    { label: "操作类型", prop: "description" },
    {
      label: "操作人员",
      prop: "operParam[name]",
      formatter: (row: any) => {
        try {
          if (!row.operParam) {
            return "-";
          }
          const operParam = JSON.parse(row.operParam);
          return operParam?.name || "-";
        } catch (error) {
          console.warn("解析操作人员参数失败:", error);
          return "-";
        }
      }
    },
    { label: "操作日期", prop: "operTime" },
    { label: "操作", fixed: "right", width: 120, slot: "operation" }
  ]);

  return {
    columns
  };
}
