import { request } from "@/network/request.js";

import serverPath from "./serverPath.js";

export default function setCloudText(username, content) {
  return request({
    method: "post",
    data: content,
    url: serverPath.setCloudText + username
  }).then(v => v.data).catch(err => Promise.reject(err))
}