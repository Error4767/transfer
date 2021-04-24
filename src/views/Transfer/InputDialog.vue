<template>
  <ElDialog title="输入提取码" v-model="dialogVisible">
    <ElInput class="input" v-model="inputValue"></ElInput>
    <ElButton @click="download">接收</ElButton>
  </ElDialog>
</template>

<script>
import { ref } from "vue";

import { ElDialog, ElInput, ElButton } from "element-plus";

import message from "@/common/message.js";
import serverPath from "./serverPath.js";

import { dialogVisible } from "./shareState.js";

export default {
  components: {
    ElDialog,
    ElInput,
    ElButton
  },
  setup(props) {
    const inputValue = ref("");
    return {
      dialogVisible,
      download() {
        const extractCode = +inputValue.value.trim();
        // 验证提取码为数字且长度为6
        if(typeof extractCode === "number" && String(extractCode).length === 6) {
          window.open(serverPath.fetchFile + extractCode);
        }else {
          message.warning("请输入正确格式的提取码");
        }
      },
    };
  },
};
</script>

<style scoped>
.input {
  margin: 1rem 0 1rem 0;
}
</style>