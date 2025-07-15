const Layout = () => import("@/layout/index.vue");

export default {
  path: "/project",
  name: "ProjectManagement",
  component: Layout,
  redirect: "/project/list",
  meta: {
    title: "项目管理",
    icon: "ep:folder",
    rank: 6
  },
  children: [
    {
      path: "/project/list",
      name: "ProjectList",
      component: () => import("@/views/project/list/index.vue"),
      meta: {
        title: "项目管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
