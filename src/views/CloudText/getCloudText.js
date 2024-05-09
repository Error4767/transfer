import { request } from "@/network/request.js";

import serverPath from "./serverPath.js";

export default function getCloudText(username) {
  return request({
    method: "get",
    url: serverPath.getCloudText + username
  }).then(v => v.data).catch(err => Promise.reject(err))
}