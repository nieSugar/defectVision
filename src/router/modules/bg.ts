const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system/bg",
  name: "BGManagement",
  component: Layout,
  redirect: "/system/bg/list",
  meta: {
    title: "BG管理",
    icon: "ep:location",
    rank: 6
  },
  children: [
    {
      path: "/system/bg/list",
      name: "BGList",
      component: () => import("@/views/system/bg/list/index.vue"),
      meta: {
        title: "BG管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
