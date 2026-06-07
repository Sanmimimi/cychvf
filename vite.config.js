import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import obfuscatorPlugin from 'vite-plugin-obfuscator'

export default defineConfig({
  plugins: [
    vue(),
    obfuscatorPlugin({
      // 极度混淆配置
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 1,
      debugProtection: true,
      debugProtectionInterval: 4000,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 5,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayEncoding: ['rc4'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 5,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersType: 'function',
      stringArrayThreshold: 1,
      transformObjectKeys: true,
      unicodeEscapeSequence: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // 打包成一个文件
        inlineDynamicImports: true
      }
    },
    // 禁用 sourcemap
    sourcemap: false,
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        toplevel: true,
        safari10: true
      }
    }
  }
})
