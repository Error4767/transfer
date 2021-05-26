import { request } from "@/network/request";
import serverPath from "./serverPath.js";

import splitChunksUpload from "./splitChunksUpload.js";

export default function uploadFile({ filename, file, onUploadProgress, cancel }) {
  if (file.size <= 10485760) {// 10mb以下不分片
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
    }).then(({data})=> {
      return Promise.resolve(data);
    });
  } else {
    return splitChunksUpload({
      file,
      onUploadProgress,
      cancel,
      uploadChunkUri: serverPath.uploadChunk,
      mergeChunksUri: serverPath.mergeChunks
    });
  }
}