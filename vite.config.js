import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    rollupOptions: {
      output: {
        // 打包成一个文件
        inlineDynamicImports: true,
        // 手动分包，防止代码分割
        manualChunks: undefined
      }
    },
    // 禁用 sourcemap
    sourcemap: false,
    // 使用 terser 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        toplevel: true,
        safari10: true,
        // 混淆属性名
        properties: {
          regex: /^_/
        }
      },
      output: {
        // 美化输
        comments: false,
        // 使用Unicode转义序列
        ascii_only: true
      },
      // 开启名称混淆
      keep_classnames: false,
      keep_fnames: false,
      toplevel: true
    },
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 1000,
    // 输出目录
    outDir: 'dist',
    // 静态资源目录
    assetsDir: 'static',
    // 打包后的文件名
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  // 定义全局常量
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  }
})
