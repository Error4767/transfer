import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";

// element plus 样式按需加载
import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
  },
  plugins: [
    vue(),
    styleImport({
      libs: [{
        libraryName: 'element-plus',
        base: 'element-plus/theme-chalk/base.css',
        resolveStyle: (name) => {
          return `element-plus/theme-chalk/${name}.css`
        },
      }]
    }),
  ]
})