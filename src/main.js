import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局错误处理 - 发送到后端
app.config.errorHandler = (err, vm, info) => {
  try {
    const errorPayload = btoa(encodeURIComponent(JSON.stringify({
      t: Date.now(),
      e: err.toString().slice(0, 100),
      i: info,
      u: navigator.userAgent.slice(0, 200)
    })))
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/v2/logs/error', errorPayload)
    }
  } catch(e) {
    // 静默处理
  }
}

// 有全局性能监控
app.mixin({
  mounted() {
    if (window.performance && window.performance.mark) {
      try {
        window.performance.mark('comp-mount')
      } catch(e) {}
    }
  }
})

app.mount('#app')
