import { ref } from "vue";
import dayjs from "dayjs";

export function useColumns() {
  const columns = ref([
    {
      label: "项目名称",
      prop: "name",
      minWidth: 150,
      align: "center"
    },
    {
      label: "项目描述",
      prop: "description",
      minWidth: 200,
      align: "center",
      showOverflowTooltip: true
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      align: "center",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ]);

  return {
    columns
  };
}
