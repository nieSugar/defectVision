const Layout = () => import("@/layout/index.vue");

export default {
  path: "/flaw",
  name: "FlawManagement",
  component: Layout,
  redirect: "/flaw/list",
  meta: {
    title: "缺陷列表",
    icon: "ep:warning",
    rank: 7
  },
  children: [
    {
      path: "/flaw/list",
      name: "FlawList",
      component: () => import("@/views/flaw/list/index.vue"),
      meta: {
        title: "缺陷列表"
      }
    }
  ]
} satisfies RouteConfigsTable;
