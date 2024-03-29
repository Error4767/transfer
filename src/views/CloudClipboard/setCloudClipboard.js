import { request } from "@/network/request.js";

import serverPath from "./serverPath.js";

export default function setCloudClipboard(username, content) {
  return request({
    method: "post",
    data: content,
    url: serverPath.setCloudClipboard + username
  }).then(v => v.data).catch(err => Promise.reject(err))
}