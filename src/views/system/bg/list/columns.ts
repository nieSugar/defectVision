import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "名称",
      prop: "name",
      minWidth: 150
    },
    {
      label: "位置",
      prop: "location",
      minWidth: 200
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      slot: "status"
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 180,
      formatter: ({ createTime }) =>
        createTime ? new Date(createTime).toLocaleString() : ""
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ]);

  return {
    columns
  };
}
