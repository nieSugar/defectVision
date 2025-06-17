const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system/role",
  name: "RoleManagement",
  component: Layout,
  redirect: "/system/role/list",
  meta: {
    title: "角色管理",
    icon: "ep:avatar",
    rank: 2
  },
  children: [
    {
      path: "/system/role/list",
      name: "RoleList",
      component: () => import("@/views/system/role/list/index.vue"),
      meta: {
        title: "角色管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
