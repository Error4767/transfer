import SparkMD5 from "spark-md5";

// 每次调用就计算一次hash
export default function* computeFileChunksInfoGenerator(file, { chunkSize } /* options */) {

  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    // chunk数量
    chunksNumber = Math.ceil(file.size / chunkSize),
    // 当前chunk
    currentChunkIndex = 0,

    spark = new SparkMD5.ArrayBuffer(),

    fileReader = new FileReader();

  // 存放resolve方法
  let PromiseResolve;

  function* readNext() {
    let start = currentChunkIndex * chunkSize;
    let end = start + chunkSize <= file.size ? start + chunkSize : file.size;

    let chunkRange = [start, end];

    yield new Promise((resolve, reject) => {
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      // resolve传递，在下个onload事件时resolve
      PromiseResolve = resolve;
    }).then(({ chunkHash, chunkIndex }) => ({// 转换生成的值
      chunkHash,
      chunkIndex,
      chunksNumber,
      chunkRange
    }));

    // 如果还有继续计算下个切片的hash值
    if (currentChunkIndex < chunksNumber) {
      yield* readNext();
    }
  }

  fileReader.onload = (e) => {
    let result = e.target.result;
    spark.append(result);

    let chunkIndex = currentChunkIndex;
    currentChunkIndex++;

    // 计算该chunk的hash并且保存
    let chunkHash = SparkMD5.ArrayBuffer.hash(result);

    PromiseResolve({
      chunkHash,
      chunkIndex
    });
  };

  fileReader.onerror = (e) => {
    reject(e);
  };
  yield* readNext();
}