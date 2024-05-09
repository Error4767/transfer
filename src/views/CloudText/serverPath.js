import networkPath from "@/network/networkPath.js";

const origin = networkPath.api;

export default {
  getCloudText: origin + "/cloud_text/get/",
  setCloudText: origin + "/cloud_text/add/"
}