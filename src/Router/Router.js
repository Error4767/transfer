import { createRouter, createWebHistory } from "vue-router";

const TransferFiles = ()=> import("@/views/TransferFiles/TransferFiles.vue");
const CloudClipboard = ()=> import("@/views/CloudClipboard/CloudClipboard.vue");
const CloudClipboardEnter = ()=> import("@/views/CloudClipboardEnter/CloudClipboardEnter.vue");

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
    path: "/CloudClipboard",
    component: CloudClipboardEnter,
  },
  {
    path: "/CloudClipboard/:username",
    component: CloudClipboard,
  },
];

export default createRouter({
  routes,
  history: createWebHistory()
});