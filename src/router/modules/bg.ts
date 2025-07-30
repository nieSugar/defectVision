const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system/bg",
  name: "BgManagement",
  component: Layout,
  redirect: "/system/bg/list",
  meta: {
    title: "bg管理",
    icon: "ep:setting",
    rank: 6
  },
  children: [
    {
      path: "/system/bg/list",
      name: "BgList",
      component: () => import("@/views/system/bg/list/index.vue"),
      meta: {
        title: "bg管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
