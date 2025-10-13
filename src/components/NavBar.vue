<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo 区域 -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-icon">
            <i class="icon-orange"></i>
          </div>
          <div class="brand-text">
            <span class="brand-name">橘橙影志</span>
            <span class="brand-tagline">橘橙暖时光，影志话悠长</span>
          </div>
        </router-link>
      </div>

      <!-- 搜索区域 -->
      <div class="navbar-search">
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="搜索电影、电视剧、动漫..."
            class="search-input"
          />
          <button @click="handleSearch" class="search-btn">
            <i class="icon-search"></i>
          </button>
        </div>
      </div>

      <!-- 主导航菜单 -->
      <div class="navbar-menu">
        <router-link to="/" class="nav-item" :class="{ active: $route.name === 'Home' }">
          <i class="nav-icon icon-home"></i>
          <span class="nav-text">首页</span>
        </router-link>
        
        <router-link to="/forum" class="nav-item" :class="{ active: $route.name === 'Forum' }">
          <i class="nav-icon icon-forum"></i>
          <span class="nav-text">论坛</span>
        </router-link>
        
        <div class="nav-dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <button class="nav-item dropdown-trigger">
            <i class="nav-icon icon-category"></i>
            <span class="nav-text">分类</span>
            <i class="dropdown-arrow icon-arrow-down" :class="{ rotated: showDropdown }"></i>
          </button>
          <div class="dropdown-menu" :class="{ show: showDropdown }">
            <div class="dropdown-content">
              <div class="dropdown-section">
                <h4 class="section-title">影视分类</h4>
                <div class="category-grid">
                  <router-link to="/forum/movie" class="category-item">
                    <i class="category-icon icon-film"></i>
                    <span>电影</span>
                  </router-link>
                  <router-link to="/forum/tv" class="category-item">
                    <i class="category-icon icon-tv"></i>
                    <span>电视剧</span>
                  </router-link>
                  <router-link to="/forum/anime" class="category-item">
                    <i class="category-icon icon-anime"></i>
                    <span>动漫</span>
                  </router-link>
                  <router-link to="/forum/variety" class="category-item">
                    <i class="category-icon icon-variety"></i>
                    <span>综艺</span>
                  </router-link>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-section">
                <h4 class="section-title">热门标签</h4>
                <div class="tag-list">
                  <a href="#" class="tag-item">科幻</a>
                  <a href="#" class="tag-item">悬疑</a>
                  <a href="#" class="tag-item">爱情</a>
                  <a href="#" class="tag-item">动作</a>
                  <a href="#" class="tag-item">喜剧</a>
                  <a href="#" class="tag-item">恐怖</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <router-link to="/trending" class="nav-item">
          <i class="nav-icon icon-star"></i>
          <span class="nav-text">热门</span>
        </router-link>
      </div>

      <!-- 用户区域 -->
      <div class="navbar-user">
        <div v-if="!isLoggedIn" class="auth-section">
          <router-link to="/login" class="auth-btn login-btn">
            <i class="icon-user"></i>
            <span>登录</span>
          </router-link>
          <router-link to="/register" class="auth-btn register-btn">
            <i class="icon-plus"></i>
            <span>注册</span>
          </router-link>
        </div>
        
        <div v-else class="user-section">
          <!-- 通知按钮 -->
          <div class="notification-wrapper">
            <button class="notification-btn" @click="toggleNotifications">
              <i class="icon-bell"></i>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>
          </div>
          
          <!-- 用户菜单 -->
          <div class="user-menu" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
            <button class="user-trigger">
              <img :src="user.avatar" :alt="user.username" class="user-avatar" />
              <div class="user-info">
                <span class="username">{{ user.username }}</span>
                <span class="user-level">Lv.{{ user.level }}</span>
              </div>
              <i class="user-arrow icon-arrow-down" :class="{ rotated: showUserMenu }"></i>
            </button>
            
            <div class="user-dropdown" :class="{ show: showUserMenu }">
              <div class="user-profile">
                <img :src="user.avatar" :alt="user.username" class="profile-avatar" />
                <div class="profile-info">
                  <h4>{{ user.username }}</h4>
                  <!-- <p>{{ user.nickname }}</p> -->
                </div>
              </div>
              <div class="user-menu-list">
                <router-link to="/user/profile" class="menu-item">
                  <i class="menu-icon icon-user"></i>
                  <span>个人中心</span>
                </router-link>
                <router-link to="/user/posts" class="menu-item">
                  <i class="menu-icon icon-edit"></i>
                  <span>我的帖子</span>
                </router-link>
                <router-link to="/user/bookmarks" class="menu-item">
                  <i class="menu-icon icon-bookmark"></i>
                  <span>我的收藏</span>
                </router-link>
                <router-link to="/user/settings" class="menu-item">
                  <i class="menu-icon icon-settings"></i>
                  <span>账户设置</span>
                </router-link>
                <div class="menu-divider"></div>
                <button @click="handleLogout" class="menu-item logout-item">
                  <i class="menu-icon icon-logout"></i>
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>


  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const searchQuery = ref('')
const showDropdown = ref(false)
const showUserMenu = ref(false)
const unreadCount = ref(3)

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)

// 方法
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'Search',
      query: { q: searchQuery.value }
    })
  } else {
    router.push({ name: 'Search' })
  }
}


const toggleNotifications = () => {
  console.log('切换通知面板')
  unreadCount.value = 0
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  showUserMenu.value = false
}
</script>

<style lang="scss" scoped>
// 导航栏基础样式
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(249, 115, 22, 0.1);
  z-index: 1000;
  height: 70px;
  transition: all 0.3s ease;
  width: 100%;
  display: block;
}

.navbar-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 24px;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

// Logo 样式
.navbar-brand {
  flex: 0 0 auto;
  flex-shrink: 0;
  display: block;
  visibility: visible;
  
  .brand-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: #1f2937;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .brand-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 28px rgba(249, 115, 22, 0.4);
      }
      
      .icon-film {
        font-size: 22px;
        color: white;
      }
    }
    
    .brand-text {
      display: flex;
      flex-direction: column;
      
      .brand-name {
        font-weight: 700;
        font-size: 20px;
        line-height: 1.2;
        color: #1f2937;
        letter-spacing: -0.5px;
      }
      
      .brand-tagline {
        font-size: 11px;
        color: #6b7280;
        font-weight: 500;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-top: 2px;
      }
    }
  }
}

// 搜索区域
.navbar-search {
  flex: 1 1 auto;
  max-width: 500px;
  min-width: 0;
  display: block;
  visibility: visible;
  
  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    background: #f8fafc;
    border: 2px solid transparent;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:focus-within {
      background: white;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    
    .search-input {
      flex: 1;
      padding: 12px 16px;
      border: none;
      background: transparent;
      font-size: 14px;
      color: #374151;
      outline: none;
      
      &::placeholder {
        color: #9ca3af;
      }
    }
    
    .search-btn {
      padding: 12px 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0 10px 10px 0;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--primary-dark);
        transform: scale(1.05);
      }
      
      i {
        font-size: 16px;
      }
    }
  }
}

// 主导航菜单
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
  flex-shrink: 0;
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    text-decoration: none;
    color: #6b7280;
    border-radius: 12px;
    transition: all 0.3s ease;
    font-size: 15px;
    font-weight: 500;
    position: relative;
    white-space: nowrap;
    
    &:hover, &.active {
      color: var(--primary-color);
      background: var(--bg-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(249, 115, 22, 0.15);
    }
    
    &.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 3px;
      background: var(--primary-color);
      border-radius: 2px;
    }
    
    .nav-icon {
      font-size: 16px;
    }
    
    .nav-text {
      font-weight: 500;
    }
  }
}

// 下拉菜单
.nav-dropdown {
  position: relative;
  
  .dropdown-trigger {
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    
    .dropdown-arrow {
      font-size: 12px;
      transition: transform 0.3s ease;
      
      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
  
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    background: white;
    border: 1px solid rgba(249, 115, 22, 0.1);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    min-width: 320px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
    overflow: hidden;
    
    &.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-content {
      padding: 20px;
    }
    
    .dropdown-section {
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .section-title {
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 12px 0;
      }
    }
    
    .category-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      
      .category-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        text-decoration: none;
        color: #374151;
        border-radius: 8px;
        transition: all 0.2s ease;
        
        &:hover {
          background: var(--bg-primary);
          color: var(--primary-color);
          transform: translateX(4px);
        }
        
        .category-icon {
          font-size: 16px;
          color: var(--primary-color);
        }
      }
    }
    
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      
      .tag-item {
        padding: 6px 12px;
        background: #f1f5f9;
        color: #64748b;
        text-decoration: none;
        border-radius: 20px;
        font-size: 12px;
        transition: all 0.2s ease;
        
        &:hover {
          background: var(--primary-color);
          color: white;
        }
      }
    }
    
    .dropdown-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 16px 0;
    }
  }
}

// 用户区域
.navbar-user {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 0 0 auto;
  flex-shrink: 0;
  visibility: visible;
  
    .auth-section {
    display: flex;
    gap: 12px;
    
    .auth-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &.login-btn {
        color: #6b7280;
        background: #f8fafc;
        
        &:hover {
          color: var(--primary-color);
          background: var(--bg-primary);
        }
      }
      
      &.register-btn {
        color: white;
        background: var(--primary-color);
        
        &:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
        }
      }
    }
  }
  
  .user-section {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .notification-wrapper {
      position: relative;
      
      .notification-btn {
        width: 40px;
        height: 40px;
        border: none;
        background: #f8fafc;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        
        &:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
        }
        
        i {
          font-size: 18px;
        }
      }
      
      .notification-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ef4444;
        color: white;
        font-size: 10px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      }
    }
    
    .user-menu {
      position: relative;
      
      .user-trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 12px;
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--bg-primary);
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-color);
        }
        
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          
          .username {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            line-height: 1.2;
          }
          
          .user-level {
            font-size: 11px;
            color: var(--primary-color);
            font-weight: 500;
          }
        }
        
        .user-arrow {
          font-size: 12px;
          color: #6b7280;
          transition: transform 0.3s ease;
          
          &.rotated {
            transform: rotate(180deg);
          }
        }
      }
      
      .user-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: white;
        border: 1px solid rgba(249, 115, 22, 0.1);
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        min-width: 280px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
        overflow: hidden;
        
        &.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .user-profile {
          padding: 20px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          display: flex;
          align-items: center;
          gap: 15px;
          
          .profile-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(255, 255, 255, 0.3);
          }
          
          .profile-info {
            h4 {
              margin: 0 0 4px 0;
              font-size: 16px;
              font-weight: 600;
            }
            
            p {
              margin: 0;
              font-size: 12px;
              opacity: 0.8;
            }
          }
        }
        
        .user-menu-list {
          padding: 8px 0;
          
          .menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            text-decoration: none;
            color: #374151;
            transition: all 0.2s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            
            &:hover {
              background: var(--bg-primary);
              color: var(--primary-color);
              transform: translateX(4px);
            }
            
            &.logout-item {
              color: #ef4444;
              
              &:hover {
                background: #fef2f2;
                color: #dc2626;
              }
            }
            
            .menu-icon {
              font-size: 16px;
              width: 16px;
              text-align: center;
            }
          }
          
          .menu-divider {
            height: 1px;
            background: #e2e8f0;
            margin: 8px 0;
          }
        }
      }
    }
  }
}



// 动画
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

</style>