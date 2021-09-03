import networkPath from "@/network/networkPath.js";

const origin = networkPath.api;

export default {
  getCloudClipboard: origin + "/cloud_clipboard/get/",
  setCloudClipboard: origin + "/cloud_clipboard/add/"
}