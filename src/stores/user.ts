import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData, ApiResponse, ProfileUpdateData } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token') || null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // 动作
  const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    try {
      const response = await mockLogin(credentials)
      
      if (response.success) {
        user.value = response.user as User
        token.value = response.token as string
        localStorage.setItem('token', response.token as string)
        localStorage.setItem('user', JSON.stringify(response.user))
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '登录失败，请稍后重试' }
    }
  }

  const register = async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await mockRegister(userData)
      
      if (response.success) {
        user.value = response.user as User
        token.value = response.token as string
        localStorage.setItem('token', response.token as string)
        localStorage.setItem('user', JSON.stringify(response.user))
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '注册失败，请稍后重试' }
    }
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = (): void => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && token.value) {
      try {
        user.value = JSON.parse(storedUser) as User
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        logout()
      }
    }
  }

  const updateProfile = async (profileData: ProfileUpdateData): Promise<ApiResponse> => {
    try {
      const response = await mockUpdateProfile(profileData)
      
      if (response.success) {
        user.value = { ...user.value, ...response.user } as User
        localStorage.setItem('user', JSON.stringify(user.value))
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '更新失败，请稍后重试' }
    }
  }

  // 模拟API函数
  const mockLogin = async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的模拟验证
    if (credentials.username === 'admin' && credentials.password === '123456') {
      return {
        success: true,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          nickname: '管理员',
          level: 10,
          joinDate: '2024-01-01',
          postsCount: 156,
          followersCount: 1234,
          followingCount: 567
        },
        token: 'mock-jwt-token-' + Date.now()
      }
    } else {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }
  }

  const mockRegister = async (userData: RegisterData): Promise<ApiResponse<User>> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的模拟注册
    if (userData.username && userData.email && userData.password) {
      return {
        success: true,
        user: {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          nickname: userData.nickname || userData.username,
          level: 1,
          joinDate: new Date().toISOString().split('T')[0],
          postsCount: 0,
          followersCount: 0,
          followingCount: 0
        },
        token: 'mock-jwt-token-' + Date.now()
      }
    } else {
      return {
        success: false,
        message: '请填写完整信息'
      }
    }
  }

  const mockUpdateProfile = async (profileData: ProfileUpdateData): Promise<ApiResponse<User>> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      user: profileData as User
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    loadUserFromStorage,
    updateProfile
  }
})
