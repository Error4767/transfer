<template>
  <ElButton @click="createDialog">进入云剪切板</ElButton>
</template>

<script>
import { ElButton } from "element-plus";

import { useRouter } from "vue-router";
import Swal from "@/common/sweetAlert.js";
import { invalidFilename } from "@/common/regExp.js";

export default {
  components: {
    ElButton
  },
  setup() {
    const router = useRouter();

    return {
      createDialog() {
        Swal.fire({
          title: "输入用户名进入对应剪切板",
          allowOutsideClick: false,
          input: "text",
          showLoaderOnConfirm: true,
          showCloseButton: true,
          inputPlaceholder: "用户名",
          confirmButtonText: "进入",
          preConfirm: (username) => {
            router.push(`/CloudClipboard/${username}`);
          },
          inputValidator: (username) => {
            // 验证提取码为数字且长度为6
            if (!invalidFilename.test(username)) {
              return Promise.resolve();
            } else {
              return "用户名不合法，请重新输入";
            }
          },
        });
      },
    };
  },
};
</script>

<style scoped>
</style>