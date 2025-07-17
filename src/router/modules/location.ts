const Layout = () => import("@/layout/index.vue");

export default {
  path: "/location",
  name: "LocationManagement",
  component: Layout,
  redirect: "/location/list",
  meta: {
    title: "位置管理",
    icon: "ep:data-analysis",
    rank: 7
  },
  children: [
    {
      path: "/location/list",
      name: "LocationList",
      component: () => import("@/views/location/list/index.vue"),
      meta: {
        title: "位置管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
