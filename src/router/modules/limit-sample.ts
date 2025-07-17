const Layout = () => import("@/layout/index.vue");

export default {
  path: "/limit-sample",
  name: "LimitSampleManagement",
  component: Layout,
  redirect: "/limit-sample/list",
  meta: {
    title: "限度样管理",
    icon: "ep:data-analysis",
    rank: 7
  },
  children: [
    {
      path: "/limit-sample/list",
      name: "LimitSampleList",
      component: () => import("@/views/limit-sample/list/index.vue"),
      meta: {
        title: "限度样管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
