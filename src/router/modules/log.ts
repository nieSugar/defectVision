const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system/log",
  name: "LogManagement",
  component: Layout,
  redirect: "/system/log/list",
  meta: {
    title: "日志管理",
    icon: "ep:document",
    rank: 5
  },
  children: [
    {
      path: "/system/log/list",
      name: "LogList",
      component: () => import("@/views/system/log/list/index.vue"),
      meta: {
        title: "日志管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
