export function useColumns() {
  const columns: TableColumnList = [
    { label: "名称", prop: "name", width: 200 },
    { label: "图标", slot: "icon" },
    { label: "排序", prop: "rank", sortable: true },
    { label: "权限标识", prop: "perms", width: 200 },
    { label: "组件路径", prop: "path", width: 300 },
    { label: "状态", slot: "status" },
    { label: "创建时间", prop: "modifyTime" },
    { label: "操作", fixed: "right", width: 240, slot: "operation" }
  ];

  return {
    columns
  };
}
