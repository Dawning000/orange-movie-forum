<template>
  <div class="user-profile">
    <div class="container">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="user" class="profile-content">
        <!-- 用户信息卡片 -->
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar-section">
              <img :src="user.avatar" :alt="user.username" class="user-avatar" />
              <button class="edit-avatar-btn" @click="showAvatarModal = true">
                <i class="icon-camera"></i>
              </button>
            </div>
            <div class="user-info">
              <h1 class="username">{{ user.username }}</h1>
              <p class="user-nickname" v-if="user.nickname">{{ user.nickname }}</p>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ user.postsCount }}</span>
                  <span class="stat-label">帖子</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ user.followersCount }}</span>
                  <span class="stat-label">粉丝</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ user.followingCount }}</span>
                  <span class="stat-label">关注</span>
                </div>
              </div>
            </div>
            <div class="profile-actions">
              <button class="btn btn-outline" @click="showEditModal = true">
                <i class="icon-edit"></i>
                编辑资料
              </button>
              <button class="btn btn-primary" @click="handleFollow">
                {{ isFollowing ? '取消关注' : '关注' }}
              </button>
            </div>
          </div>
          
          <div class="profile-details">
            <div class="detail-item" v-if="user.bio">
              <i class="icon-user"></i>
              <span>{{ user.bio }}</span>
            </div>
            <div class="detail-item">
              <i class="icon-calendar"></i>
              <span>加入时间：{{ formatDate(user.joinDate) }}</span>
            </div>
            <div class="detail-item" v-if="user.location">
              <i class="icon-location"></i>
              <span>{{ user.location }}</span>
            </div>
            <div class="detail-item" v-if="user.website">
              <i class="icon-link"></i>
              <a :href="user.website" target="_blank" class="website-link">{{ user.website }}</a>
            </div>
          </div>
        </div>

        <!-- 标签页导航 -->
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
          </button>
        </div>

        <!-- 标签页内容 -->
        <div class="tab-content">
          <!-- 帖子列表 -->
          <div v-if="activeTab === 'posts'" class="posts-section">
            <div v-if="userPosts.length === 0" class="empty-state">
              <i class="icon-empty"></i>
              <h3>暂无帖子</h3>
              <p>该用户还没有发布任何帖子</p>
            </div>
            <div v-else class="posts-list">
              <div v-for="post in userPosts" :key="post.id" class="post-item">
                <div class="post-header">
                  <div class="post-meta">
                    <span class="post-category">{{ post.categoryName }}</span>
                    <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                  </div>
                </div>
                <h3 class="post-title">
                  <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
                </h3>
                <p class="post-excerpt">{{ post.excerpt }}</p>
                <div class="post-stats">
                  <span class="stat">
                    <i class="icon-eye"></i>
                    {{ post.views }}
                  </span>
                  <span class="stat">
                    <i class="icon-comment"></i>
                    {{ post.comments }}
                  </span>
                  <span class="stat">
                    <i class="icon-like"></i>
                    {{ post.likes }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 收藏列表 -->
          <div v-if="activeTab === 'bookmarks'" class="bookmarks-section">
            <div v-if="bookmarks.length === 0" class="empty-state">
              <i class="icon-bookmark"></i>
              <h3>暂无收藏</h3>
              <p>该用户还没有收藏任何帖子</p>
            </div>
            <div v-else class="bookmarks-list">
              <div v-for="bookmark in bookmarks" :key="bookmark.id" class="bookmark-item">
                <div class="bookmark-header">
                  <div class="bookmark-meta">
                    <img :src="bookmark.post.author.avatar" :alt="bookmark.post.author.username" class="author-avatar" />
                    <div class="author-info">
                      <span class="author-name">{{ bookmark.post.author.username }}</span>
                      <span class="bookmark-time">{{ formatTime(bookmark.createdAt) }}</span>
                    </div>
                  </div>
                </div>
                <h3 class="bookmark-title">
                  <router-link :to="`/post/${bookmark.post.id}`">{{ bookmark.post.title }}</router-link>
                </h3>
                <p class="bookmark-excerpt">{{ bookmark.post.excerpt }}</p>
              </div>
            </div>
          </div>

          <!-- 关注列表 -->
          <div v-if="activeTab === 'following'" class="following-section">
            <div v-if="following.length === 0" class="empty-state">
              <i class="icon-users"></i>
              <h3>暂无关注</h3>
              <p>该用户还没有关注任何人</p>
            </div>
            <div v-else class="following-list">
              <div v-for="followedUser in following" :key="followedUser.id" class="following-item">
                <img :src="followedUser.avatar" :alt="followedUser.username" class="following-avatar" />
                <div class="following-info">
                  <h4 class="following-name">
                    <router-link :to="`/user/${followedUser.id}`">{{ followedUser.username }}</router-link>
                  </h4>
                  <p class="following-bio" v-if="followedUser.bio">{{ followedUser.bio }}</p>
                  <div class="following-stats">
                    <span>{{ followedUser.postsCount }} 帖子</span>
                    <span>{{ followedUser.followersCount }} 粉丝</span>
                  </div>
                </div>
                <button class="btn btn-outline btn-sm" @click="handleUnfollow(followedUser)">
                  取消关注
                </button>
              </div>
            </div>
          </div>

          <!-- 片单 -->
          <div v-if="activeTab === 'lists'" class="lists-section">
            <div class="list-actions">
              <button class="btn btn-primary" @click="createList">新建片单</button>
            </div>
            <div v-if="Object.keys(library.lists).length === 0" class="empty-state">
              <i class="icon-list"></i>
              <h3>暂无片单</h3>
              <p>创建你的第一个片单，整理想看与看过的影片</p>
            </div>
            <div v-else class="lists-grid">
              <div class="list-card" v-for="ls in Object.values(library.lists)" :key="ls.id">
                <div class="list-cover"></div>
                <div class="list-meta">
                  <h3>{{ ls.title }}</h3>
                  <p class="sub">{{ ls.itemIds.length }} 部作品 · {{ ls.isPublic ? '公开' : '私密' }}</p>
                </div>
                <div class="list-actions-row">
                  <router-link class="btn btn-outline btn-sm" :to="{name:'ListShare', params:{id: ls.id}}">查看/分享</router-link>
                  <button class="btn btn-outline btn-sm" @click="togglePrivacy(ls.id)">{{ ls.isPublic ? '设为私密' : '设为公开' }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资料模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑资料</h3>
          <button class="close-btn" @click="closeEditModal">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpdateProfile">
            <div class="form-group">
              <label>昵称</label>
              <input 
                type="text" 
                v-model="editForm.nickname"
                placeholder="请输入昵称"
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>个人简介</label>
              <textarea 
                v-model="editForm.bio"
                placeholder="介绍一下自己..."
                rows="4"
                class="form-textarea"
              ></textarea>
            </div>
            <div class="form-group">
              <label>所在地</label>
              <input 
                type="text" 
                v-model="editForm.location"
                placeholder="请输入所在地"
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>个人网站</label>
              <input 
                type="url" 
                v-model="editForm.website"
                placeholder="请输入个人网站"
                class="form-input"
              >
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeEditModal">
                取消
              </button>
              <button type="submit" class="btn btn-primary" :disabled="updating">
                {{ updating ? '保存中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLibraryStore } from '@/stores/library'

const route = useRoute()
const library = useLibraryStore()

// 响应式数据
const loading = ref(true)
const user = ref(null)
const userPosts = ref([])
const bookmarks = ref([])
const following = ref([])
const activeTab = ref('posts')
const showEditModal = ref(false)
const showAvatarModal = ref(false)
const updating = ref(false)
const isFollowing = ref(false)

const editForm = reactive({
  nickname: '',
  bio: '',
  location: '',
  website: ''
})

const tabs = [
  { id: 'posts', label: '帖子', icon: 'icon-edit' },
  { id: 'bookmarks', label: '收藏', icon: 'icon-bookmark' },
  { id: 'following', label: '关注', icon: 'icon-users' },
  { id: 'lists', label: '片单', icon: 'icon-list' }
]

// 方法
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

const loadUserProfile = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    user.value = {
      id: parseInt(route.params.id),
      username: '科幻迷小王',
      nickname: '小王',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: '热爱科幻电影的影迷，喜欢分享观影心得',
      location: '北京',
      website: 'https://example.com',
      joinDate: '2024-01-01',
      postsCount: 156,
      followersCount: 1234,
      followingCount: 567
    }
    
    userPosts.value = [
      {
        id: 1,
        title: '《流浪地球2》深度解析：中国科幻电影的里程碑',
        excerpt: '作为《流浪地球》的续作，这部电影在视觉效果和故事深度上都有了显著提升...',
        categoryName: '电影',
        views: 1234,
        comments: 89,
        likes: 156,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: '《阿凡达：水之道》观后感',
        excerpt: '时隔13年，卡梅隆再次带我们回到潘多拉星球...',
        categoryName: '电影',
        views: 856,
        comments: 45,
        likes: 98,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
    
    bookmarks.value = [
      {
        id: 1,
        post: {
          id: 3,
          title: '《狂飙》为什么这么火？',
          excerpt: '这部扫黑除恶题材的电视剧能够成为现象级作品...',
          author: {
            username: '剧评达人',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
          }
        },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ]
    
    following.value = [
      {
        id: 2,
        username: '剧评达人',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face',
        bio: '专业剧评人，专注电视剧分析',
        postsCount: 89,
        followersCount: 2345
      },
      {
        id: 3,
        username: '动漫爱好者',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
        bio: '二次元世界探索者',
        postsCount: 67,
        followersCount: 1234
      }
    ]
    
    // 初始化编辑表单
    editForm.nickname = user.value.nickname
    editForm.bio = user.value.bio
    editForm.location = user.value.location
    editForm.website = user.value.website
  } finally {
    loading.value = false
  }
}

const handleFollow = () => {
  isFollowing.value = !isFollowing.value
  if (isFollowing.value) {
    user.value.followersCount++
  } else {
    user.value.followersCount--
  }
}

const handleUnfollow = (followedUser) => {
  const index = following.value.findIndex(u => u.id === followedUser.id)
  if (index > -1) {
    following.value.splice(index, 1)
    user.value.followingCount--
  }
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleUpdateProfile = async () => {
  updating.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户信息
    user.value.nickname = editForm.nickname
    user.value.bio = editForm.bio
    user.value.location = editForm.location
    user.value.website = editForm.website
    
    closeEditModal()
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  loadUserProfile()
})

function createList(){
  const id = 'list-' + Date.now()
  library.ensureList(id, '我的片单')
}

function togglePrivacy(id){
  const ls = library.lists[id]
  if (!ls) return
  ls.isPublic = !ls.isPublic
}
</script>

<style lang="scss" scoped>
.user-profile {
  min-height: 100vh;
  background: #f9fafb;
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #6b7280;
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

// 用户信息卡片
.profile-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 30px;
  margin-bottom: 30px;
}

.avatar-section {
  position: relative;
  
  .user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #e5e7eb;
  }
  
  .edit-avatar-btn {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 36px;
    height: 36px;
    background: #3b82f6;
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
      background: #2563eb;
      transform: scale(1.1);
    }
  }
}

.user-info {
  flex: 1;
  
  .username {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 5px;
  }
  
  .user-nickname {
    font-size: 1.1rem;
    color: #6b7280;
    margin-bottom: 20px;
  }
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #6b7280;
  }
}

.profile-actions {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 14px;
  
  i {
    color: #9ca3af;
    width: 16px;
  }
  
  .website-link {
    color: #3b82f6;
    text-decoration: none;
    
    &:hover {
      color: #2563eb;
    }
  }
}

// 标签页
.tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &.active {
    background: #3b82f6;
    color: white;
  }
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.lists-grid{ display:grid; grid-template-columns: repeat(2,1fr); gap:16px; }
.list-card{ border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff; }
.list-cover{ height:120px; background:#f3f4f6; }
.list-meta{ padding:12px; }
.list-meta .sub{ color:#6b7280; font-size:12px; }
.list-actions-row{ display:flex; gap:8px; padding:0 12px 12px; }

// 帖子列表
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.post-item {
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
}

.post-header {
  margin-bottom: 15px;
}

.post-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  
  .post-category {
    padding: 4px 12px;
    background: #eff6ff;
    color: #3b82f6;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .post-time {
    color: #9ca3af;
    font-size: 12px;
  }
}

.post-title {
  margin-bottom: 10px;
  
  a {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    text-decoration: none;
    
    &:hover {
      color: #3b82f6;
    }
  }
}

.post-excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  gap: 20px;
  
  .stat {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #9ca3af;
    font-size: 14px;
  }
}

// 收藏列表
.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bookmark-item {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
}

.bookmark-header {
  margin-bottom: 15px;
}

.bookmark-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
  
  .author-name {
    font-weight: 500;
    color: #1f2937;
    font-size: 14px;
  }
  
  .bookmark-time {
    color: #9ca3af;
    font-size: 12px;
  }
}

.bookmark-title {
  margin-bottom: 10px;
  
  a {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    text-decoration: none;
    
    &:hover {
      color: #3b82f6;
    }
  }
}

.bookmark-excerpt {
  color: #6b7280;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 关注列表
.following-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.following-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
}

.following-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.following-info {
  flex: 1;
  
  .following-name {
    margin-bottom: 5px;
    
    a {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      text-decoration: none;
      
      &:hover {
        color: #3b82f6;
      }
    }
  }
  
  .following-bio {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .following-stats {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #9ca3af;
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  
  i {
    font-size: 4rem;
    color: #d1d5db;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #374151;
  }
  
  p {
    margin: 0;
  }
}

// 模态框
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e5e7eb;
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #f3f4f6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      background: #e5e7eb;
    }
  }
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

// 按钮样式
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &.btn-primary {
    background: #3b82f6;
    color: white;
    
    &:hover:not(:disabled) {
      background: #2563eb;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &.btn-outline {
    background: transparent;
    color: #6b7280;
    border-color: #d1d5db;
    
    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }
  
  &.btn-sm {
    padding: 6px 12px;
    font-size: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .profile-card {
    padding: 25px;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .profile-actions {
    width: 100%;
    justify-content: center;
  }
  
  .tabs {
    flex-direction: column;
    gap: 5px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .following-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .following-info {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 20px;
  }
  
  .user-info .username {
    font-size: 1.5rem;
  }
  
  .user-stats {
    gap: 20px;
  }
  
  .modal-content {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
}
</style>
