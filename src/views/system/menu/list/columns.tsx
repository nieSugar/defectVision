export function useColumns() {
  const columns: TableColumnList = [
    { label: "名称", prop: "name" },
    { label: "权限标识", prop: "perms" },
    { label: "排序", prop: "rank", sortable: true },
    { label: "操作", fixed: "right", width: 240, slot: "operation" }
  ];

  return {
    columns
  };
}
