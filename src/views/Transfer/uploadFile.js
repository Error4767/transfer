import { request } from "@/network/request";
import serverPath from "./serverPath.js";

export default function uploadFile({ filename, file, onUploadProgress, cancel}) {
  return request({
    method: "post",
    url: serverPath.upload,
    headers: {
      filename
    },
    cancelToken: cancel ? new request.CancelToken(cancel) : null,
    onUploadProgress,
    data: file
  });
}