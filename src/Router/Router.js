import { createRouter, createWebHistory } from "vue-router";

const Transfer = ()=> import("@/views/Transfer/Transfer.vue");
const CloudClipboard = ()=> import("@/views/CloudClipboard/CloudClipboard.vue");

const routes = [
  {
    path: "/",
    component: Transfer
  },
  {
    path: "/CloudClipboard/:username",
    component: CloudClipboard,
  }
];

export default createRouter({
  routes,
  history: createWebHistory()
});