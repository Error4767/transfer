<template>
  <ElMenu class="menu" mode="horizontal">
    <ElMenuItem :index="String(Math.random())" @click="router.push('/')">
      主页
    </ElMenuItem>
    <ElMenuItem :index="String(Math.random())" @click="router.push('/transferFiles')">
      文件传输
    </ElMenuItem>
    <ElMenuItem :index="String(Math.random())" @click="router.push('/CloudClipboard')">
      云剪切板
    </ElMenuItem>
  </ElMenu>
</template>

<script>
import { ElMenu, ElMenuItem } from "element-plus";
import { useRouter } from "vue-router";

export default {
  components: {
    ElMenu,
    ElMenuItem,
  },
  setup() {
    const router = useRouter();
    return {
      router,
    }
  }
};
</script>

<style scoped>
/* 取消下划线，(有下划线目前可能是 element plus 的一个bug) */
.menu a {
  text-decoration: none;
}
</style>