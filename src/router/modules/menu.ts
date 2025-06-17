const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system/menu",
  name: "MenuManagement",
  component: Layout,
  redirect: "/system/menu/list",
  meta: {
    title: "菜单管理",
    icon: "ep:menu",
    rank: 4
  },
  children: [
    {
      path: "/system/menu/list",
      name: "MenuList",
      component: () => import("@/views/system/menu/list/index.vue"),
      meta: {
        title: "菜单管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
