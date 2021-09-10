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
/* 取消下划线，(有下划线目前可能是 element plus 的一个bug) */
.menu a {
  text-decoration: none;
}
</style>