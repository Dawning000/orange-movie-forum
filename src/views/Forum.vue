<template>
  <div class="forum">
    <div class="container">
      <!-- 页面头部 -->
      <div class="forum-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="icon-forum"></i>
            {{ getCategoryTitle() }}
          </h1>
          <p class="page-subtitle">
            {{ getCategoryDescription() }}
          </p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="showCreatePost = true">
            <i class="icon-plus"></i>
            发布新帖
          </button>
        </div>
      </div>

      <!-- 筛选和排序 -->
      <div class="forum-filters">
        <div class="filter-group">
          <label>排序方式：</label>
          <select v-model="sortBy" @change="handleSortChange" class="filter-select">
            <option value="latest">最新发布</option>
            <option value="hot">最热门</option>
            <option value="views">最多浏览</option>
            <option value="comments">最多评论</option>
          </select>
        </div>
        <div class="filter-group">
          <label>时间范围：</label>
          <select v-model="timeRange" @change="handleTimeRangeChange" class="filter-select">
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索帖子..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="search-input"
          >
          <button @click="handleSearch" class="search-btn">
            <i class="icon-search"></i>
          </button>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="posts-container">
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="filteredPosts.length === 0" class="empty-state">
          <i class="icon-empty"></i>
          <h3>暂无帖子</h3>
          <p>还没有人在这里发布帖子，快来成为第一个吧！</p>
          <button class="btn btn-primary" @click="showCreatePost = true">
            发布第一个帖子
          </button>
        </div>
        
        <div v-else class="posts-list">
          <div v-for="post in paginatedPosts" :key="post.id" class="post-item">
            <div class="post-votes">
              <button class="vote-btn upvote" :class="{ active: post.userVote === 'up' }" @click="handleVote(post, 'up')">
                <i class="icon-arrow-up"></i>
              </button>
              <span class="vote-count">{{ post.votes }}</span>
              <button class="vote-btn downvote" :class="{ active: post.userVote === 'down' }" @click="handleVote(post, 'down')">
                <i class="icon-arrow-down"></i>
              </button>
            </div>
            
            <div class="post-content">
              <div class="post-header">
                <div class="post-meta">
                  <img :src="post.author.avatar" :alt="post.author.username" class="author-avatar" />
                  <div class="author-info">
                    <router-link :to="`/user/${post.author.id}`" class="author-name">
                      {{ post.author.username }}
                    </router-link>
                    <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                  </div>
                </div>
                <div class="post-category">
                  <span :class="`category-tag category-${post.category}`">{{ post.categoryName }}</span>
                </div>
              </div>
              
              <router-link :to="`/post/${post.id}`" class="post-title">
                {{ post.title }}
              </router-link>
              
              <p class="post-excerpt">{{ post.excerpt }}</p>
              
              <div class="post-tags" v-if="post.tags && post.tags.length > 0">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              
              <div class="post-footer">
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
                    <i class="icon-share"></i>
                    分享
                  </span>
                </div>
                <div class="post-actions">
                  <button class="action-btn" @click="handleBookmark(post)">
                    <i class="icon-bookmark" :class="{ active: post.isBookmarked }"></i>
                  </button>
                  <button class="action-btn" @click="handleShare(post)">
                    <i class="icon-share"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            上一页
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 创建帖子模态框 -->
    <div v-if="showCreatePost" class="modal-overlay" @click="closeCreatePost">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>发布新帖子</h3>
          <button class="close-btn" @click="closeCreatePost">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreatePost">
            <div class="form-group">
              <label>标题</label>
              <input 
                type="text" 
                v-model="newPost.title"
                placeholder="请输入帖子标题..."
                required
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>分类</label>
              <select v-model="newPost.category" required class="form-select">
                <option value="">请选择分类</option>
                <option value="movie">电影</option>
                <option value="tv">电视剧</option>
                <option value="anime">动漫</option>
                <option value="variety">综艺</option>
              </select>
            </div>
            <div class="form-group">
              <label>标签</label>
              <input 
                type="text" 
                v-model="newPost.tagsInput"
                placeholder="用逗号分隔多个标签..."
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>内容</label>
              <textarea 
                v-model="newPost.content"
                placeholder="分享你的想法..."
                rows="8"
                required
                class="form-textarea"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeCreatePost">
                取消
              </button>
              <button type="submit" class="btn btn-primary" :disabled="creating">
                {{ creating ? '发布中...' : '发布帖子' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const posts = ref([])
const sortBy = ref('latest')
const timeRange = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const postsPerPage = ref(10)
const showCreatePost = ref(false)
const creating = ref(false)

const newPost = ref({
  title: '',
  category: '',
  tagsInput: '',
  content: ''
})

// 计算属性
const filteredPosts = computed(() => {
  let filtered = [...posts.value]
  
  // 按分类筛选
  if (route.params.category) {
    filtered = filtered.filter(post => post.category === route.params.category)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 按时间范围筛选
  if (timeRange.value !== 'all') {
    const now = new Date()
    const timeMap = {
      today: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    }
    const timeLimit = now.getTime() - timeMap[timeRange.value]
    filtered = filtered.filter(post => new Date(post.createdAt).getTime() > timeLimit)
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'hot':
        return (b.votes + b.comments * 2) - (a.votes + a.comments * 2)
      case 'views':
        return b.views - a.views
      case 'comments':
        return b.comments - a.comments
      case 'latest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage.value))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage.value
  const end = start + postsPerPage.value
  return filteredPosts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 方法
const getCategoryTitle = () => {
  const categoryMap = {
    movie: '电影讨论',
    tv: '电视剧讨论',
    anime: '动漫讨论',
    variety: '综艺讨论'
  }
  return categoryMap[route.params.category] || '影视论坛'
}

const getCategoryDescription = () => {
  const descMap = {
    movie: '分享最新电影评论，讨论经典影片',
    tv: '热播剧集深度解析，追剧心得分享',
    anime: '二次元世界精彩内容讨论',
    variety: '娱乐综艺节目观后感分享'
  }
  return descMap[route.params.category] || '与千万影迷一起讨论精彩内容'
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

const loadPosts = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    posts.value = [
      {
        id: 1,
        title: '《流浪地球2》深度解析：中国科幻电影的里程碑',
        excerpt: '作为《流浪地球》的续作，这部电影在视觉效果和故事深度上都有了显著提升。从技术层面来看，影片的特效制作已经达到了国际先进水平...',
        content: '详细内容...',
        author: {
          id: 1,
          username: '科幻迷小王',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        category: 'movie',
        categoryName: '电影',
        tags: ['科幻', '流浪地球', '中国电影'],
        views: 1234,
        comments: 89,
        votes: 156,
        userVote: null,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: '《狂飙》为什么这么火？从剧情到演技全面分析',
        excerpt: '这部扫黑除恶题材的电视剧能够成为现象级作品，背后有哪些成功因素？让我们从多个角度来分析...',
        content: '详细内容...',
        author: {
          id: 2,
          username: '剧评达人',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
        },
        category: 'tv',
        categoryName: '电视剧',
        tags: ['狂飙', '悬疑', '国产剧'],
        views: 2156,
        comments: 134,
        votes: 289,
        userVote: 'up',
        isBookmarked: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: '《鬼灭之刃》剧场版观后感：热血与感动的完美结合',
        excerpt: '作为鬼灭之刃的忠实粉丝，看完剧场版后内心久久不能平静。这部作品在保持原有风格的基础上...',
        content: '详细内容...',
        author: {
          id: 3,
          username: '动漫爱好者',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        category: 'anime',
        categoryName: '动漫',
        tags: ['鬼灭之刃', '剧场版', '热血'],
        views: 987,
        comments: 67,
        votes: 123,
        userVote: null,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]
  } finally {
    loading.value = false
  }
}

const handleSortChange = () => {
  currentPage.value = 1
}

const handleTimeRangeChange = () => {
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleVote = (post, type) => {
  if (post.userVote === type) {
    post.userVote = null
    post.votes -= type === 'up' ? 1 : -1
  } else {
    const oldVote = post.userVote
    post.userVote = type
    post.votes += type === 'up' ? 1 : -1
    if (oldVote) {
      post.votes += oldVote === 'up' ? -1 : 1
    }
  }
}

const handleBookmark = (post) => {
  post.isBookmarked = !post.isBookmarked
}

const handleShare = (post) => {
  // 实现分享功能
  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.excerpt,
      url: window.location.origin + `/post/${post.id}`
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`)
    alert('链接已复制到剪贴板')
  }
}

const closeCreatePost = () => {
  showCreatePost.value = false
  newPost.value = {
    title: '',
    category: '',
    tagsInput: '',
    content: ''
  }
}

const handleCreatePost = async () => {
  creating.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const tags = newPost.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    const post = {
      id: Date.now(),
      title: newPost.value.title,
      excerpt: newPost.value.content.substring(0, 100) + '...',
      content: newPost.value.content,
      author: {
        id: 1,
        username: '当前用户',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      category: newPost.value.category,
      categoryName: {
        movie: '电影',
        tv: '电视剧',
        anime: '动漫',
        variety: '综艺'
      }[newPost.value.category],
      tags,
      views: 0,
      comments: 0,
      votes: 0,
      userVote: null,
      isBookmarked: false,
      createdAt: new Date()
    }
    
    posts.value.unshift(post)
    closeCreatePost()
    
    // 跳转到新帖子
    router.push(`/post/${post.id}`)
  } finally {
    creating.value = false
  }
}

// 监听路由变化
watch(() => route.params.category, () => {
  currentPage.value = 1
  loadPosts()
})

// 监听搜索参数
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch
  }
})

onMounted(() => {
  loadPosts()
  
  // 如果有搜索参数，设置搜索框
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})
</script>

<style lang="scss" scoped>
.forum {
  min-height: 100vh;
  background: #f9fafb;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 页面头部
.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.header-content {
  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    
    i {
      color: #3b82f6;
    }
  }
  
  .page-subtitle {
    color: #6b7280;
    font-size: 1.1rem;
    margin: 0;
  }
}

.header-actions {
  .btn {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

// 筛选器
.forum-filters {
  display: flex;
  gap: 30px;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  
  label {
    font-weight: 500;
    color: #374151;
    white-space: nowrap;
  }
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.search-box {
  display: flex;
  align-items: center;
  margin-left: auto;
  
  .search-input {
    padding: 8px 15px;
    border: 1px solid #d1d5db;
    border-radius: 6px 0 0 6px;
    font-size: 14px;
    min-width: 200px;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
  
  .search-btn {
    padding: 8px 15px;
    background: #3b82f6;
    border: 1px solid #3b82f6;
    border-radius: 0 6px 6px 0;
    color: white;
    cursor: pointer;
    
    &:hover {
      background: #2563eb;
    }
  }
}

// 帖子列表
.posts-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.loading {
  padding: 60px;
  text-align: center;
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

.empty-state {
  padding: 80px 40px;
  text-align: center;
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
    margin-bottom: 30px;
  }
}

.posts-list {
  .post-item {
    display: flex;
    padding: 25px;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.2s;
    
    &:hover {
      background: #f9fafb;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.post-votes {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  min-width: 60px;
  
  .vote-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #f3f4f6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #e5e7eb;
    }
    
    &.active {
      background: #3b82f6;
      color: white;
    }
    
    &.upvote.active {
      background: #10b981;
    }
    
    &.downvote.active {
      background: #ef4444;
    }
  }
  
  .vote-count {
    font-weight: 600;
    color: #374151;
    margin: 8px 0;
    font-size: 14px;
  }
}

.post-content {
  flex: 1;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
  
  .author-name {
    font-weight: 600;
    color: #1f2937;
    text-decoration: none;
    font-size: 14px;
    
    &:hover {
      color: #3b82f6;
    }
  }
  
  .post-time {
    color: #9ca3af;
    font-size: 12px;
  }
}

.category-tag {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  
  &.category-movie {
    background: #fef3c7;
    color: #d97706;
  }
  
  &.category-tv {
    background: #dbeafe;
    color: #2563eb;
  }
  
  &.category-anime {
    background: #f3e8ff;
    color: #7c3aed;
  }
  
  &.category-variety {
    background: #fce7f3;
    color: #be185d;
  }
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  line-height: 1.4;
  
  &:hover {
    color: #3b82f6;
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

.post-tags {
  margin-bottom: 15px;
  
  .tag {
    display: inline-block;
    padding: 4px 8px;
    background: #f3f4f6;
    color: #6b7280;
    border-radius: 12px;
    font-size: 12px;
    margin-right: 8px;
    margin-bottom: 4px;
  }
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.post-actions {
  display: flex;
  gap: 10px;
  
  .action-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #f3f4f6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #e5e7eb;
    }
    
    i.active {
      color: #3b82f6;
    }
  }
}

// 分页
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 30px;
  background: #f9fafb;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
}

.page-numbers {
  display: flex;
  gap: 5px;
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
  max-width: 600px;
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
.form-select,
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
  min-height: 120px;
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
}

// 响应式设计
@media (max-width: 768px) {
  .forum-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .forum-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .search-box {
    margin-left: 0;
    
    .search-input {
      min-width: auto;
      flex: 1;
    }
  }
  
  .post-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .post-votes {
    flex-direction: row;
    justify-content: center;
    margin-right: 0;
    min-width: auto;
  }
  
  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
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
