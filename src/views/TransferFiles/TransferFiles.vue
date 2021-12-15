<template>
  <div>
    <!-- 不在上传状态的时候显示发送文件按钮 -->
    <ElButton v-if="!progressVisible" @click="upload" :icon="Upload">
      发送文件
    </ElButton>
    <!-- 上传状态时显示进度信息 -->
    <ElSpace v-if="progressVisible" :size="10" direction="vertical">
      <UploadProgress
        :total="totalSize"
        :loaded="loadedSize"
        :filename="filename"
        :status="status"
      ></UploadProgress>

      <!-- 总尺寸大于0代表开始上传，且以上传的尺寸等于总尺寸，且状态为未完成 -->
      <div
        v-if="
          totalSize !== 0 && loadedSize === totalSize && status !== 'success'
        "
      >
        合并文件分片中... 这可能需要一点时间
      </div>

      <!-- 点击完成关闭进度显示 -->
      <div v-if="status === 'success'">
        <div class="extract-code">提取码: {{ extractCode }}</div>
        <ElButton @click="resetAll" :icon="SuccessFilled">完成</ElButton>
      </div>

      <div>
        <!-- status强制类型转换为false时则不显示取消上传按钮 -->
        <ElButton v-if="!status || status === 'exception'" @click="resetAll">
          取消上传
        </ElButton>
        <ElButton
          v-if="status === 'exception'"
          @click="currentUploadFn"
          :icon="RefreshRight"
        >
          重试
        </ElButton>
      </div>
    </ElSpace>

    <ElDivider></ElDivider>

    <ElButton :icon="Download" @click="showDialog"> 接收文件 </ElButton>
  </div>
</template>

<script>
import { ref } from "vue";

import { ElButton, ElSpace, ElDivider } from "element-plus";
import { Upload ,Download ,SuccessFilled, RefreshRight } from "@element-plus/icons-vue";
import UploadProgress from "./UploadProgress.vue";

import { typeOf } from "unstable";
import uploadFile from "./uploadFile.js";
import message from "@/common/message.js";

import serverPath from "./serverPath.js";

import Swal from "@/common/sweetAlert.js";

export default {
  components: {
    ElButton,
    UploadProgress,
    ElSpace,
    ElDivider,
  },
  setup() {
    // 文件名
    const filename = ref("");
    // 是否显示上传信息
    const progressVisible = ref(false);
    // 总尺寸
    const totalSize = ref(0);
    // 已经上传的尺寸
    const loadedSize = ref(0);
    // 进度条状态
    const status = ref("");
    // 取消上传
    const cancel = ref(() => {});
    // 当前的上传函数，用于重试请求
    const currentUploadFn = ref(() => {});
    // 提取码
    const extractCode = ref("");

    // 重置当前上传所有信息
    function resetStates() {
      status.value = "";
      totalSize.value = 0;
      loadedSize.value = 0;

      cancel.value && cancel.value();
      cancel.value = () => {};

      extractCode.value = "";
    }

    // 重置所有信息(包含显示状态)
    function resetAll() {
      resetStates();
      filename.value = "";
      currentUploadFn.value = () => {};
      progressVisible.value = false;
    }

    return {
      // 图标样式
      Upload,
      Download,
      SuccessFilled,
      RefreshRight,
      // 脚本内容
      filename,
      progressVisible,
      totalSize,
      loadedSize,
      status,
      cancel,
      resetStates,
      resetAll,
      currentUploadFn,
      extractCode,
      // 显示填写提取码对话框
      showDialog() {
        // 接收文件对话框
        Swal.fire({
          title: "输入提取码",
          allowOutsideClick: false,
          input: "text",
          showLoaderOnConfirm: true,
          showCloseButton: true,
          inputPlaceholder: "6位数提取码",
          confirmButtonText: "接收",
          preConfirm: (extractCode) => {
            window.open(serverPath.fetchFile + extractCode);
          },
          inputValidator: (extractCode) => {
            // 验证提取码为数字且长度为6
            if (
              typeof Number(extractCode) === "number" &&
              !Number.isNaN(Number(extractCode)) &&
              String(extractCode).length === 6
            ) {
              return Promise.resolve();
            } else {
              return "请输入正确格式的提取码";
            }
          },
        });
      },
      upload() {
        let $fileInput = document.createElement("input");
        $fileInput.type = "file";
        $fileInput.addEventListener("change", (e) => {
          // 获得文件
          let file = $fileInput.files[0];
          // 检测有效性
          if (typeOf(file) !== "File") {
            return false;
          }
          $fileInput = null;
          e.value = null;

          // 设置文件名
          filename.value = file.name;
          // 显示进度信息组件
          progressVisible.value = true;
          // 上传
          const uploadFn = () => {
            resetStates();
            uploadFile({
              filename: file.name,
              file,
              onUploadProgress(e) {
                const { total, loaded } = e;
                totalSize.value = total;
                loadedSize.value = loaded;
              },
              cancel(cancelFn) {
                cancel.value = cancelFn;
              },
            })
              .then((resultExtractCode) => {
                status.value = "success";
                extractCode.value = resultExtractCode;
                message.success("上传文件完成: " + file.name);
              })
              .catch((err) => {
                status.value = "exception";
                message.error(`上传文件失败: ${file.name}\r\n错误信息: ${err}`);
              });
          };
          currentUploadFn.value = uploadFn;
          uploadFn();
        });
        // 弹出文件选择框
        $fileInput.click();
      },
    };
  },
};
</script>

<style scoped>
.extract-code {
  margin: 0.5rem;
  font-size: 1.25rem;
}
</style>