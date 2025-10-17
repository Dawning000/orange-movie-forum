<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <div class="form-header">
          <h1>欢迎回来</h1>
          <p>登录到影视论坛，继续你的观影之旅</p>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名或邮箱</label>
            <input 
              type="text" 
              id="username"
              v-model="form.username"
              placeholder="请输入用户名或邮箱"
              required
              class="form-input"
              :class="{ error: errors.username }"
            >
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                placeholder="请输入密码"
                required
                class="form-input"
                :class="{ error: errors.password }"
              >
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'icon-eye-off' : 'icon-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.remember">
              <span class="checkmark"></span>
              记住我
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <div v-if="loading" class="loading-spinner"></div>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        
        <div class="form-footer">
          <p>还没有账号？ <router-link to="/register" class="link">立即注册</router-link></p>
        </div>
        
        <div class="divider">
          <span>或者</span>
        </div>
        
        <div class="social-login">
          <button class="social-btn wechat">
            <i class="icon-wechat"></i>
            微信登录
          </button>
          <button class="social-btn qq">
            <i class="icon-qq"></i>
            QQ登录
          </button>
        </div>
      </div>
      
      <div class="login-image">
        <div class="image-content">
          <h2>发现精彩影视世界</h2>
          <p>与千万影迷一起讨论最新电影、热门电视剧，分享你的观影心得</p>
          <div class="features">
            <div class="feature-item">
              <i class="icon-film"></i>
              <span>最新电影评论</span>
            </div>
            <div class="feature-item">
              <i class="icon-tv"></i>
              <span>热播剧集讨论</span>
            </div>
            <div class="feature-item">
              <i class="icon-users"></i>
              <span>影迷社区交流</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const showPassword = ref(false)
const errors = ref({})

const form = reactive({
  username: '',
  password: '',
  remember: false
})

// 方法
const validateForm = () => {
  errors.value = {}
  
  if (!form.username.trim()) {
    errors.value.username = '请输入用户名或邮箱'
  }
  
  if (!form.password) {
    errors.value.password = '请输入密码'
  } else if (form.password.length < 6) {
    errors.value.password = '密码长度至少6位'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  try {
    const result = await userStore.login({
      username: form.username,
      password: form.password
    })
    
    if (result.success) {
      // 登录成功，跳转到首页或之前访问的页面
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    } else {
      errors.value.general = result.message || '登录失败，请检查用户名和密码'
    }
  } catch (error) {
    errors.value.general = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--secondary-light) 0%, var(--secondary-color) 40%, var(--primary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;
}

.login-form {
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 10px;
  }
  
  p {
    color: #6b7280;
    font-size: 1rem;
  }
}

.form-group {
  margin-bottom: 25px;
  
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
    font-size: 14px;
  }
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--shadow-color);
  }
  
  &.error {
    border-color: #ef4444;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
}

.password-input {
  position: relative;
  
  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    
    &:hover {
      color: #6b7280;
    }
  }
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  
  input[type="checkbox"] {
    display: none;
  }
  
  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid var(--secondary-light);
    border-radius: 4px;
    margin-right: 8px;
    position: relative;
    transition: all 0.2s;
    
    &::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.2s;
    }
  }
  
  input[type="checkbox"]:checked + .checkmark {
    background: var(--primary-color);
    border-color: var(--primary-color);
    
    &::after {
      opacity: 1;
    }
  }
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    color: var(--primary-dark);
  }
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-footer {
  text-align: center;
  margin: 30px 0;
  
  p {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
  }
  
  .link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: #2563eb;
    }
  }
}

.divider {
  text-align: center;
  margin: 30px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--secondary-light);
  }
  
  span {
    background: white;
    padding: 0 20px;
    color: #9ca3af;
    font-size: 14px;
  }
}

.social-login {
  display: flex;
  gap: 15px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    border-color: var(--secondary-dark);
    transform: translateY(-1px);
  }
  
  &.wechat {
    color: #1aad19;
    
    &:hover {
      border-color: #1aad19;
      background: #f0f9f0;
    }
  }
  
  &.qq {
    color: #12b7f5;
    
    &:hover {
      border-color: #12b7f5;
      background: #f0f9ff;
    }
  }
}

.login-image {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
  color: white;
  padding: 50px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-content {
  text-align: center;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.2;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 40px;
    opacity: 0.9;
    line-height: 1.6;
  }
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1rem;
  
  i {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .login-image {
    display: none;
  }
  
  .login-form {
    padding: 40px 30px;
  }
  
  .form-header h1 {
    font-size: 1.75rem;
  }
  
  .social-login {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 10px;
  }
  
  .login-form {
    padding: 30px 20px;
  }
  
  .form-header h1 {
    font-size: 1.5rem;
  }
}
</style>
