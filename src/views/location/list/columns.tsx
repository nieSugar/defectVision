import { ref } from "vue";
import dayjs from "dayjs";

export function useColumns() {
  const columns = ref([
    {
      label: "位置名称",
      prop: "name",
      minWidth: 150,
      align: "center"
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 200,
      align: "center",
      showOverflowTooltip: true
    },
    {
      label: "项目名称",
      prop: "project.name",
      minWidth: 150,
      align: "center",
      cellRenderer: ({ row }) => {
        return row.project?.name || <span style="color: #999;">暂无</span>;
      }
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
