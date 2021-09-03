import networkPath from "@/network/networkPath.js";
const origin = networkPath.api;
export default {
  origin,
  upload: origin + "/upload",
  fetchFile: origin + "/fetch-file/",
  uploadChunk: origin + "/upload_chunk",
  mergeChunks: origin + "/merge_chunks",
  fetchUploadedChunksHashes: origin + "/fetch_uploaded_chunks_hashes"
}