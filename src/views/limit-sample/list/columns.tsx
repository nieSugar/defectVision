import { ref } from "vue";
import dayjs from "dayjs";

export function useColumns() {
  const columns = ref([
    {
      label: "限度样名称",
      prop: "name",
      minWidth: 150,
      align: "center"
    },
    {
      label: "限度样描述",
      prop: "description",
      minWidth: 200,
      align: "center",
      showOverflowTooltip: true
    },
    {
      label: "关联项目",
      prop: "project.name",
      minWidth: 150,
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
      label: "修改时间",
      prop: "modifyTime",
      minWidth: 160,
      align: "center",
      formatter: ({ modifyTime }) =>
        dayjs(modifyTime).format("YYYY-MM-DD HH:mm:ss")
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
