import computeFileChunksInfoGenerator from "./computeFileChunksInfoGenerator.js";
import axios from "axios";
import { throttle } from "unstable";

const CancelToken = axios.CancelToken;

// 获取已经上传的分片的hash
function fetchUploadedChunksHashes(fetchChunksUri, identify) {
  return axios({
    method: "post",
    url: fetchChunksUri,
    headers: {
      identify,
    }
  });
}

// 运行生成器并异步在每次计算完成一个chunk后运行回调
function runAndTrackInfo(gen, onSingleChunkComputedCallback) {
  let iter = gen();

  return new Promise((resolve, reject) => {

    const { done, value } = iter.next();

    if (!done) {
      value.then(function thenHandler(result) {
        let { done, value } = iter.next();

        onSingleChunkComputedCallback(result);

        if (!done) {
          value.then(thenHandler);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

// 获取ID的方法，用于 chunks identify 的一部分
function getID() {
  // 如果有则直接使用
  let id = localStorage.getItem("split_chunks_upload_random_id");
  if(id) {
    return id;
  }else {
    // 如果没有生成一个并存储
    id = Math.random().toString(16).substring(2, 10).padEnd(length, '0');
    localStorage.setItem("split_chunks_upload_random_id", id);
    return id;
  }
}

// chunk上传并发数
const concurrentSize = 5;

function splitChunksUpload({
  file,
  directory = "./",
  mergeChunksUri,
  uploadChunkUri,
  fetchUploadedChunksHashesUri,
  splitChunkOptions = { chunkSize: 2097152 },
  onUploadProgress = () => { },
  cancel: cancelToken = null,
}) {
  const fileSize = file.size;

  return new Promise(async (resolve, reject) => {
    // 等待中的异步操作
    const waitActions = [];
    // 正在运行的异步上传操作： Array<promise>
    const runningActions = [];
    // 各个chunk已上传的尺寸
    const uploadedChunksSizes = [];
    // 文件标识符
    const identify = encodeURI(`${getID()}${directory}${file.name}`);
    // 请求取消函数
    const cancelFunctions = [];
    // 是否已经取消请求
    let isCancel = false;
    // 取消所有
    const cancelAll = () => {
      isCancel = true;
      cancelFunctions.forEach(fn => fn());
    };

    // 用cancel函数调用cancelToken
    cancelToken(cancelAll);

    // 两次都上传失败的chunks，最后的时候会集体再试一次
    let doubleUploadFailedActions = [];

    // 遍历获得总上传尺寸
    const getUploadedSize = () => uploadedChunksSizes.reduce((p, v) => p + v, 0);

    // onUploadProgress包装函数,控制每250ms只会运行一次
    const onUploadProgressHandler = throttle(() => {
      const loaded = getUploadedSize();
      onUploadProgress({
        loaded,
        total: fileSize
      });
    }, 100);

    // 从数组中寻找指定元素，如果存在就删除
    function removeItem(runningAction) {
      let index = runningActions.findIndex((promise) => promise === runningAction);
      if (index !== -1) {
        runningActions.splice(index, 1);
      }
    }

    // 重试两次都上传失败的chunk, 如果都重试成功就发送合并chunks请求
    const resetAndMergeChunks = () => {
      // 如果请求已被取消，直接结束函数
      if (isCancel) {
        return;
      }
      return Promise.all(doubleUploadFailedActions.map(action => action()))
        .then(results => {
          const isResetSuccess = results.every(result => result === "true");
          if (!isResetSuccess) {
            return Promise.reject();
          }
          // 都成功就发起chunks合并请求
          return axios({
            method: "post",
            url: mergeChunksUri,
            headers: {
              identify,
              fullPath: encodeURI(directory + file.name)
            }
          }).then(({ data }) => {
            // 检测是否成功
            if (data === "false") {
              return Promise.reject();
            }
            resolve(data);
          })
        })
        .catch(reject);
    }

    // 运行单个动作
    const runSingleAction = (action) => {
      // 如果请求取消直接结束函数, 如果请求已经被取消，就没有必要重试请求
      if (isCancel) {
        return;
      }
      // 检测并发数，决定执行动作或者添加到等待队列
      if (runningActions.length < concurrentSize) {
        const runningAction = action().then(({ data }) => {
          // 检测分片上传是否真正成功
          if (data === "false") {
            return Promise.reject("false");
          }
          // 成功请求就从运行中数组中删除该项任务
          removeItem(runningAction);
          // 如果都是0则是上传完成，发起合并请求
          if (runningActions.length === 0 && waitActions.length === 0) {
            resetAndMergeChunks();
            return;
          };

          if (waitActions.length > 0) {
            runSingleAction(waitActions.pop());
          }
        }).catch(() => {
          if (isCancel) {
            return;
          }
          // 首次立即重试
          const reoloadRunningAction = action().then(({ data }) => {
            // 检测分片上传是否真正成功
            if (data === "false") {
              return Promise.reject("false");
            }
            // 成功请求就从运行中数组中删除该项任务
            removeItem(reoloadRunningAction);
            if (runningActions.length === 0 && waitActions.length === 0) {
              resetAndMergeChunks();
              return;
            };

            if (waitActions.length > 0) {
              runSingleAction(waitActions.pop());
            }
          }).catch(() => {
            if (isCancel) {
              return;
            }
            // 重试错误添加数组中
            doubleUploadFailedActions.push(action);
            // 删除当前失败的任务
            removeItem(reoloadRunningAction);
          });
          runningActions.push(reoloadRunningAction);

          // 从数组中删除失败的promise
          removeItem(runningAction);
        });
        runningActions.push(runningAction);
      } else {
        // 添加到等待队列
        waitActions.push(action);
      }
    };

    // 取得已经上传的所有chuunk的hash
    const uploadedChunksHashes = await fetchUploadedChunksHashes(fetchUploadedChunksHashesUri, identify)
      .then(r => r.data)
      .catch(() => []);

    // 异步计算chunks数据，计算好之后回调，并且开始上传分片，并限制一定的并发数
    runAndTrackInfo(() => computeFileChunksInfoGenerator(file, splitChunkOptions), (chunkInfo) => {
      // 取出该chunk数据
      const { chunkHash, chunkIndex, chunksNumber, chunkRange: [start, end] } = chunkInfo;
      // 如果后端已经有该分片，不再上传
      if (uploadedChunksHashes.includes(chunkHash)) {
        // 设置已上传大小为chunk尺寸
        uploadedChunksSizes[chunkIndex] = end - start;
        // 触发进度更新
        onUploadProgressHandler();
        // 如果是最后一个分片(index是数量-1)，且都是0则是上传完成，发起合并请求
        if (chunkIndex >= chunksNumber - 1 && runningActions.length === 0 && waitActions.length === 0) {
          resetAndMergeChunks();
        };
        return;
      }

      const action = () => axios({
        method: "post",
        url: uploadChunkUri,
        data: file.slice(start, end),
        headers: {
          identify,
          chunkHash,
          chunkIndex,
          chunksNumber
        },
        onUploadProgress(e) {
          uploadedChunksSizes[chunkIndex] = e.loaded;
          // 调用进度函数，该函数在上面已经设置节流
          onUploadProgressHandler();
        },
        cancelToken: cancelToken ? new CancelToken((cancel) => {
          cancelFunctions[chunkIndex] = cancel;
        }) : null
      });
      runSingleAction(action);
    });
  });
}

export default splitChunksUpload;