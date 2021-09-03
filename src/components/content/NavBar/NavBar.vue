<template>
  <ElMenu class="menu" mode="horizontal">
    <ElMenuItem>
      <router-link to="/">主页</router-link>
    </ElMenuItem>
    <ElMenuItem>
      <router-link to="/transferFiles">文件传输</router-link>
    </ElMenuItem>
    <ElMenuItem>
      <router-link to="/CloudClipboard">云剪切板</router-link>
    </ElMenuItem>
  </ElMenu>
</template>

<script>
import { ElMenu, ElMenuItem } from "element-plus";

export default {
  components: {
    ElMenu,
    ElMenuItem,
  },
};
</script>

<style scoped>
</style>