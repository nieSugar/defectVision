const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system/dictionary",
  name: "DictionaryManagement",
  component: Layout,
  redirect: "/system/dictionary/list",
  meta: {
    title: "字典管理",
    icon: "ep:collection",
    rank: 5,
    showLink: false
  },
  children: [
    {
      path: "/system/dictionary/list",
      name: "DictionaryList",
      component: () => import("@/views/system/dictionary/list/index.vue"),
      meta: {
        title: "字典管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
