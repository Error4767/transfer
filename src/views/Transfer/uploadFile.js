import { request } from "@/network/request";
import serverPath from "./serverPath.js";

export default function uploadFile({ filename, file, onUploadProgress, cancel}) {
  return request({
    method: "post",
    url: serverPath.upload,
    headers: {
      // 编码为url格式，使其符合iso-8859-1
      filename: encodeURI(filename)
    },
    cancelToken: cancel ? new request.CancelToken(cancel) : null,
    onUploadProgress,
    data: file
  });
}