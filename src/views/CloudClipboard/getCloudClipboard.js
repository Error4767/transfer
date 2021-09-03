import { request } from "@/network/request.js";

import serverPath from "./serverPath.js";

export default function getCloudClipboard(username) {
  return request({
    method: "get",
    url: serverPath.getCloudClipboard + username
  }).then(v => v.data).catch(err => Promise.reject(err))
}