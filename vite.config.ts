import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 跳过TypeScript类型检查，只进行构建
    rollupOptions: {
      onwarn(warning, warn) {
        // 忽略TypeScript相关的警告
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        warn(warning)
      }
    }
  },
  esbuild: {
    // 在生产构建中忽略未使用的导入
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
})
