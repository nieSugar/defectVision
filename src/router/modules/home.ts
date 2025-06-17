const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/system/user/list",
  meta: {
    title: "首页",
    icon: "ep:home-filled",
    rank: 0,
    showLink: false
  }
} satisfies RouteConfigsTable;
