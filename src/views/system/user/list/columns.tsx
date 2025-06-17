import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    { label: "名称", prop: "userName" },
    { label: "昵称", prop: "nickName" },
    { label: "手机号", prop: "phoneNumber" },
    { label: "邮箱", prop: "email" },
    { label: "状态", slot: "status" },
    { label: "创建时间", prop: "createdTime" },
    { label: "操作", fixed: "right", width: 180, slot: "operation" }
  ]);

  return {
    columns
  };
}
