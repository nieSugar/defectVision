export function useColumns() {
  const columns: TableColumnList = [
    { label: "名称", prop: "name", align: "left" },
    { label: "状态", slot: "status" },
    { label: "创建时间", prop: "modifyTime" },
    { label: "操作", fixed: "right", width: 200, slot: "operation" }
  ];

  return {
    columns
  };
}
