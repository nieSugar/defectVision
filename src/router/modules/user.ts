const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system/user",
  name: "UserManagement",
  component: Layout,
  redirect: "/system/user/list",
  meta: {
    title: "用户管理",
    icon: "ep:user",
    rank: 1
  },
  children: [
    {
      path: "/system/user/list",
      name: "UserList",
      component: () => import("@/views/system/user/list/index.vue"),
      meta: {
        title: "用户管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
