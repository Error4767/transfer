import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";

// element plus 样式按需加载
import vitePluginElementPlus from "vite-plugin-element-plus";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
  },
  plugins: [
    vue(),
    vitePluginElementPlus()
  ]
})
