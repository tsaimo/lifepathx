import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 使用 Vue 插件解析单文件组件。
export default defineConfig({
  plugins: [vue()],
})
