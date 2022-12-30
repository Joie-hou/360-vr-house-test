import { Component } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export type CustomRouteRecordRaw = RouteRecordRaw & {
  meta?: {
    redirectable?: true;
    requiredLogin?: true;
  };
  components?: Record<string, Component>;
  children?: CustomRouteRecordRaw[];
};

const routes: Array<CustomRouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "home",
    path: "/home",
    redirect: "/home/preview",
    component: () => import("@/views/Index.vue"),
    meta: {
      redirectable: true,
    },
    children: [
      {
        path: "/home/preview",
        name: "preview",
        components: {
          preview: () => import("@/views/EditPreview/Preview.vue"),
        },
      },
      {
        path: "/home/edit",
        name: "edit",
        components: {
          edit: () => import("@/views/EditPreview/Edit.vue"),
        },
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
