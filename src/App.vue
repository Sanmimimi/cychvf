<template>
  <div class="app-root" :class="{ 'loading': isLoading }">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="initial-loader">
      <div class="loader-spinner"></div>
      <p class="loader-text">正在验证会话状态...</p>
    </div>

    <!-- 主登录界面 -->
    <LoginForm v-else @login-success="handleLoginSuccess" />
    
    <!-- 后台任务提示 -->
    <div class="debug-info" v-if="showDebugInfo">
      <small>Session: {{ fakeSessionId }}</small>
      <small>Region: cn-shanghai-03</small>
      <small>Build: 2.4.1</small>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoginForm from './components/LoginForm.vue'

const isLoading = ref(true)
const showDebugInfo = ref(false)
const fakeSessionId = ref('')

// 启动时的会话检查
onMounted(async () => {
  // 生成会话ID
  fakeSessionId.value = 'sess_' + Array.from(
    { length: 32 }, 
    () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('')

  // 网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
  
  isLoading.value = false

  // 开发环境显示调试信息
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    showDebugInfo.value = true
  }
})

const handleLoginSuccess = (credentials) => {
  // 处理登录成功
  console.log('Auth token generated')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-root {
  min-height: 100vh;
  background: #0f1119;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

.initial-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(79, 110, 247, 0.2);
  border-top-color: #4f6ef7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-text {
  color: #6b7194;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.debug-info {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.debug-info small {
  color: #4f6ef7;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  opacity: 0.7;
}
</style>
