<template>
  <ElButton @click="createDialog" size="large">进入云文本</ElButton>
</template>

<script>
import { ElButton } from "element-plus";

import { useRouter } from "vue-router";
import Swal from "@/common/sweetAlert.js";
import { invalidFilename } from "@/common/regExp.js";

export default {
  components: {
    ElButton,
  },
  setup() {
    const router = useRouter();

    const createDialog = () => {
      Swal.fire({
        title: "输入用户名进入对应云文本",
        allowOutsideClick: false,
        input: "text",
        showLoaderOnConfirm: true,
        showCloseButton: true,
        inputPlaceholder: "用户名",
        confirmButtonText: "进入",
        preConfirm: (username) => {
          router.push(`/CloudText/${username}`);
        },
        inputValidator: (username) => {
          if (!invalidFilename.test(username)) {
            return Promise.resolve();
          } else {
            return "用户名不合法，请重新输入";
          }
        },
      });
    };
    createDialog();

    return {
      createDialog,
    };
  },
};
</script>

<style scoped>
</style>