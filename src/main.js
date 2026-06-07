import { createApp } from 'vue'
import App from './App.vue'

// 路由守卫和状态管理
const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  // 发送错误到后端
  const errorPayload = btoa(encodeURIComponent(JSON.stringify({
    timestamp: Date.now(),
    error: err.toString().slice(0, 100),
    info: info,
    userAgent: navigator.userAgent.slice(0, 200)
  })))
  
  // 发送
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/v2/logs/error', errorPayload)
  }
}

// 全局 mixin
app.mixin({
  mounted() {
    // 性能监控
    if (window.performance && window.performance.mark) {
      window.performance.mark('component-mounted')
    }
  }
})

app.mount('#app')
