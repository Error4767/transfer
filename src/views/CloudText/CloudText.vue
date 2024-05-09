<template>
  <ElCard class="cloud_text">
    <template #header>
      <div class="header">
        <div class="username">{{ username }}</div>
        <ElButton @click="copyContent">复制</ElButton>
        <!-- 查看视图 -->
        <div v-if="!isEditing" class="edit-operation" @click="enterEditing">
          <div class="edit-operation-text">编辑</div>
          <ElIcon size="16">
            <Edit></Edit>
          </ElIcon>
        </div>
        <!-- 编辑视图 -->
        <div v-else class="edit-operation" @click="endEdit">
          <div class="edit-operation-text">保存更改</div>
          <ElIcon size="16">
            <CircleCheck></CircleCheck>
          </ElIcon>
        </div>
      </div>
    </template>

    <div class="scroll-container" v-if="!isEditing">
      <ElScrollbar>
        <div class="content">
          {{ cloudTextContent }}
        </div>
      </ElScrollbar>
    </div>
    <ElInput
      v-else
      class="input"
      v-model="cloudTextContent"
      type="textarea"
      maxlength="8000"
      show-word-limit
      rows="15"
    >
    </ElInput>
  </ElCard>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import getCloudText from "./getCloudText.js";
import setCloudText from "./setCloudText.js";

import { ElCard, ElButton, ElIcon, ElInput, ElScrollbar } from "element-plus";

import { Edit, CircleCheck } from "@element-plus/icons-vue";

import message from "@/common/message.js";
import { invalidFilename } from "@/common/regExp.js";

export default {
  components: {
    ElCard,
    ElButton,
    ElIcon,
    Edit,
    CircleCheck,
    ElInput,
    ElScrollbar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const username = route.params.username;

    // 云文本内容
    const cloudTextContent = ref("");
    // 编辑状态
    const isEditing = ref(false);

    // 用户名合法性检测
    if (invalidFilename.test(username)) {
      message.warning("用户名不合法, 3秒后自动返回");
      setTimeout(() => router.go(-1), 3000);
    } else {
      // 初始化请求一次尝试获取云文本内容
      getCloudText(username)
        .then((v) => (cloudTextContent.value = v))
        .catch(() => {});
    }

    return {
      // 名字
      username,
      // 云文本内容
      cloudTextContent,
      // 编辑状态
      isEditing,
      // 进入编辑状态
      enterEditing() {
        isEditing.value = true;
      },
      // 结束编辑状态和保存数据
      endEdit() {
        isEditing.value = false;
        const value = cloudTextContent.value;
        setCloudText(username, value)
          .then(() => message.success("保存成功"))
          .catch(() => message.error("保存失败"));
      },
      // 复制按钮
      copyContent() {
        navigator.clipboard
          .writeText(cloudTextContent.value)
          .then(() => message.success("复制成功"))
          .catch(() => message.error("复制失败"));
      },
    };
  },
};
</script>

<style scoped lang="postcss">
.cloud_text {
  height: 500px;
  margin: 2rem;
  & .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    & .edit-operation {
      font-size: 0.8rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      padding: 0.6rem;
      border: 1px solid #eee;
      border-radius: 5%;
      & .edit-operation-text {
        margin-right: 10px;
      }
    }
  }
  & .scroll-container {
    height: 370px;
  }
  /* 这里的样式与 Element Plus input textarea 的样式大致相同，为了点击编辑之后没有内容偏移 */
  & .content {
    text-align: left;
    white-space: pre-wrap;
    padding: 0.35rem 0 0 1rem;
  }
  & .input {
    width: 100%;
    height: 370px;
    font-weight: bold;
  }
  & .content,
  & .input {
    font-family: monospace, sans-serif;
    font-size: 1rem;
    line-height: 1.5rem;
    color: #555;
  }
}
</style>