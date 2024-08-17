import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: '',  // 代理地址
        changeOrigin: true,  // 是否跨域
        rewrite:(path) => path.replace(/^\/api/,'') // 去掉接口地址中的api字符串
      }
    },
  }
})
