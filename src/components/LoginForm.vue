<template>
  <div class="login-wrapper">
    <!-- 背景装饰 - 后端连接状态 -->
    <div class="bg-grid"></div>
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>

    <!-- 系统状态指示器 -->
    <div class="system-status">
      <span class="status-dot" :class="{ online: serverStatus }"></span>
      <span class="status-text">{{ serverStatus ? '系统运行中' : '维护中' }}</span>
      <span class="status-version">v2.4.1</span>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9"/>
            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="logo-title">Horizon</h1>
        <span class="logo-badge">内部系统</span>
      </div>

      <!-- 表单标题 -->
      <div class="form-header">
        <h2>身份验证</h2>
        <p>请输入您的域账户凭据</p>
      </div>

      <!-- 全局错误提示 -->
      <transition name="slide-fade">
        <div v-if="showGlobalError" class="global-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>认证失败：用户名或密码错误</span>
          <button @click="showGlobalError = false" class="error-close">×</button>
        </div>
      </transition>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="login-form" autocomplete="off">
        <!-- 用户名 -->
        <div class="form-group">
          <label class="form-label">域账户</label>
          <div class="input-container" :class="{ error: errors.username, focused: focusedField === 'username' }">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
              ref="usernameInput"
              v-model="formData.username"
              type="text"
              placeholder="username@horizon.internal"
              @focus="focusedField = 'username'"
              @blur="focusedField = null"
              @input="clearError('username')"
              autocomplete="off"
              spellcheck="false"
            >
            <span class="input-domain">@horizon.internal</span>
          </div>
          <transition name="slide-fade">
            <p v-if="errors.username" class="field-error">{{ errors.username }}</p>
          </transition>
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label class="form-label">安全凭证</label>
          <div class="input-container" :class="{ error: errors.password, focused: focusedField === 'password' }">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              @focus="focusedField = 'password'"
              @blur="focusedField = null"
              @input="clearError('password')"
              autocomplete="off"
            >
            <button type="button" class="toggle-visibility" @click="showPassword = !showPassword" tabindex="-1">
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8s4-8 11-8 11 8 11 8-1.89 3.31-5.06 5.94"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <transition name="slide-fade">
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </transition>
        </div>

        <!-- 选项行 -->
        <div class="options-row">
          <label class="remember-option">
            <input type="checkbox" v-model="formData.remember">
            <span class="checkbox-custom"></span>
            <span>保持登录状态</span>
          </label>
          <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">重置凭据</a>
        </div>

        <!-- 提交按钮 -->
        <button 
          type="submit" 
          class="submit-btn" 
          :class="{ loading: isSubmitting }"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">验证身份</span>
          <span v-else class="btn-loading">
            <span class="spinner"></span>
            验证中...
          </span>
        </button>
      </form>

      <!-- 安全提示 -->
      <div class="security-notice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M12 16v-3"/>
          <circle cx="12" cy="8" r="1"/>
        </svg>
        <span>本系统采用JWT令牌认证，会话有效期6分钟</span>
      </div>
    </div>

    <!-- 底部信息 -->
    <footer class="login-footer">
      <span>© 2024 Horizon Technologies</span>
      <span class="separator">·</span>
      <span>内部系统 v2.4.1</span>
      <span class="separator">·</span>
      <span>安全等级：高</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const emit = defineEmits(['login-success'])

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  remember: false
})

// 状态管理
const showPassword = ref(false)
const focusedField = ref(null)
const showGlobalError = ref(false)
const isSubmitting = ref(false)
const serverStatus = ref(true)
const errors = reactive({
  username: '',
  password: ''
})

const usernameInput = ref(null)

// 组件挂载
onMounted(() => {
  // 自动聚焦
  nextTick(() => {
    if (usernameInput.value) {
      usernameInput.value.focus()
    }
  })

  // 检查服务器状态
  checkServerStatus()

  // 有定时任务刷新token
  setInterval(() => {
    // token刷新
    const fakeRefresh = btoa(Date.now().toString(36))
  }, 300000) // 5分钟
})

// 检查服务器状态
const checkServerStatus = () => {
  // 95%概率在线
  serverStatus.value = Math.random() > 0.05
}

// 清除错误
const clearError = (field) => {
  errors[field] = ''
  if (showGlobalError.value) {
    showGlobalError.value = false
  }
}

// 表单验证
const validateForm = () => {
  let isValid = true

  if (!formData.username.trim()) {
    errors.username = '请输入域账户名称'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = '账户名称长度不能少于3个字符'
    isValid = false
  }

  if (!formData.password) {
    errors.password = '请输入安全凭证'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = '安全凭证长度不能少于6个字符'
    isValid = false
  }

  return isValid
}

// 登录请求
const handleLogin = async () => {
  // 清除之前的错误
  showGlobalError.value = false
  errors.username = ''
  errors.password = ''

  // 前端验证
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  // 网络请求延迟
  const delay = 800 + Math.random() * 1200
  await new Promise(resolve => setTimeout(resolve, delay))

  // 后端验证 
  // 生成请求ID
  const requestId = 'req_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

  // 记录登录尝试
  if (navigator.sendBeacon) {
    const logData = new Blob([JSON.stringify({
      timestamp: new Date().toISOString(),
      username: formData.username.slice(0, 3) + '***',
      ip: '10.24.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      requestId: requestId,
      status: 'failed',
      reason: 'invalid_credentials'
    })], { type: 'application/json' })
    
    navigator.sendBeacon('/api/v2/logs/auth', logData)
  }

  // 显示错误
  showGlobalError.value = true
  isSubmitting.value = false

  // 清空密码
  formData.password = ''

  // 聚焦用户名
  nextTick(() => {
    if (usernameInput.value) {
      usernameInput.value.focus()
      usernameInput.value.select()
    }
  })
}

// 忘记密码处理
const handleForgotPassword = () => {
  // 发送重置请求
  alert('请通过企业内部IT支持渠道重置凭据\n\n参考编号: IT-' + Date.now().toString(36).toUpperCase().slice(-8))
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景效果 */
.bg-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(79, 110, 247, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 110, 247, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
  pointer-events: none;
}

.bg-orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #4f6ef7, transparent 70%);
  top: -200px;
  right: -100px;
}

.bg-orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #6b8aff, transparent 70%);
  bottom: -150px;
  left: -100px;
}

/* 系统状态 */
.system-status {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(15, 17, 25, 0.8);
  border: 1px solid rgba(79, 110, 247, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  z-index: 100;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e84949;
  transition: background 0.3s;
}

.status-dot.online {
  background: #4fef7e;
  box-shadow: 0 0 10px rgba(79, 239, 126, 0.5);
}

.status-text {
  color: #8b90a5;
  font-size: 12px;
}

.status-version {
  color: #4f6ef7;
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(79, 110, 247, 0.15);
  border-radius: 4px;
}

/* 登录卡片 */
.login-card {
  width: 440px;
  max-width: 100%;
  background: rgba(20, 23, 38, 0.9);
  border: 1px solid rgba(79, 110, 247, 0.2);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(40px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(79, 110, 247, 0.05);
  position: relative;
  z-index: 10;
}

/* Logo区域 */
.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #4f6ef7, #6b8aff);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(79, 110, 247, 0.4);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.logo-badge {
  font-size: 11px;
  color: #4f6ef7;
  background: rgba(79, 110, 247, 0.15);
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 500;
}

/* 表单头部 */
.form-header {
  text-align: center;
  margin-bottom: 28px;
}

.form-header h2 {
  font-size: 22px;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-header p {
  font-size: 14px;
  color: #6b7194;
}

/* 全局错误 */
.global-error {
  background: rgba(232, 73, 73, 0.1);
  border: 1px solid rgba(232, 73, 73, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
}

.global-error svg {
  width: 18px;
  height: 18px;
  color: #e84949;
  flex-shrink: 0;
}

.global-error span {
  color: #fc8181;
  font-size: 13px;
  flex: 1;
}

.error-close {
  background: none;
  border: none;
  color: #e84949;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.error-close:hover {
  opacity: 1;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: #8b90a5;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(15, 17, 25, 0.6);
  border: 1.5px solid rgba(79, 110, 247, 0.15);
  border-radius: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-container.focused {
  border-color: #4f6ef7;
  box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.1);
}

.input-container.error {
  border-color: #e84949;
  box-shadow: 0 0 0 4px rgba(232, 73, 73, 0.1);
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.input-icon {
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.input-icon svg {
  width: 18px;
  height: 18px;
  color: #4f6ef7;
  opacity: 0.6;
}

.input-container input {
  width: 100%;
  padding: 14px 40px 14px 44px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 15px;
  outline: none;
  font-family: inherit;
}

.input-container input::placeholder {
  color: #3a3f55;
}

.input-domain {
  position: absolute;
  right: 14px;
  color: #4f6ef7;
  font-size: 12px;
  opacity: 0.5;
  pointer-events: none;
}

.toggle-visibility {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #4f6ef7;
  opacity: 0.5;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}

.toggle-visibility:hover {
  opacity: 1;
}

.toggle-visibility svg {
  width: 18px;
  height: 18px;
}

.field-error {
  color: #fc8181;
  font-size: 12px;
  margin-top: 6px;
  padding-left: 2px;
}

/* 选项行 */
.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  margin-top: 24px;
}

.remember-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #8b90a5;
  font-size: 13px;
  user-select: none;
}

.remember-option input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 1.5px solid rgba(79, 110, 247, 0.3);
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;
}

.remember-option input:checked + .checkbox-custom {
  background: #4f6ef7;
  border-color: #4f6ef7;
}

.remember-option input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.forgot-link {
  color: #4f6ef7;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #6b8aff;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4f6ef7, #6b8aff);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(79, 110, 247, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn.loading {
  background: linear-gradient(135deg, #3a54d4, #4f6ef7);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 安全提示 */
.security-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 10px 14px;
  background: rgba(79, 110, 247, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(79, 110, 247, 0.1);
}

.security-notice svg {
  width: 16px;
  height: 16px;
  color: #4f6ef7;
  flex-shrink: 0;
}

.security-notice span {
  font-size: 12px;
  color: #6b7194;
}

/* 底部 */
.login-footer {
  position: fixed;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3a3f55;
  font-size: 12px;
  z-index: 10;
}

.separator {
  opacity: 0.3;
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 响应式 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .system-status {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
  }

  .status-text {
    display: none;
  }
}
</style>
