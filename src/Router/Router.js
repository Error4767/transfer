import { createRouter, createWebHistory } from "vue-router";

const TransferFiles = ()=> import("@/views/TransferFiles/TransferFiles.vue");
const CloudText = ()=> import("@/views/CloudText/CloudText.vue");
const CloudTextEnter = ()=> import("@/views/CloudTextEnter/CloudTextEnter.vue");

const routes = [
  {
    path: "/",
    component: TransferFiles
  },
  {
    path: "/transferFiles",
    component: TransferFiles
  },
  {
    path: "/CloudText",
    component: CloudTextEnter,
  },
  {
    path: "/CloudText/:username",
    component: CloudText,
  },
];

export default createRouter({
  routes,
  history: createWebHistory()
});