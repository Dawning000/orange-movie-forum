<template>
  <div class="home">
    <!-- 轮播图 -->
    <Carousel />
    
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-header">
          <span class="hero-icon">🍊</span>
          <h1 class="hero-title">橘橙影志</h1>
        </div>
        <h2 class="hero-subtitle">橘橙暖时光，影志话悠长</h2>
        <p class="hero-description">
          在这个温暖的橘橙色调中，我们一起分享电影的美好时光，记录每一个动人的瞬间
        </p>
        <div class="hero-actions">
          <router-link to="/forum" class="btn btn-primary btn-lg">
            <span class="btn-icon">🍊</span>
            开始探索
          </router-link>
          <router-link to="/register" class="btn btn-outline btn-lg">
            <span class="btn-icon">✨</span>
            立即加入
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <div class="floating-cards">
          <div class="movie-card" v-for="(movie, index) in featuredMovies" :key="movie.id" 
               :style="{ animationDelay: `${index * 0.2}s` }">
            <img :src="movie.poster" :alt="movie.title" />
            <div class="card-overlay">
              <h4>{{ movie.title }}</h4>
              <p>{{ movie.rating }}分</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门分类 -->
    <section class="categories">
      <div class="container">
        <h2 class="section-title">热门分类</h2>
        <div class="categories-grid">
          <router-link 
            v-for="category in categories" 
            :key="category.id"
            :to="`/forum/${category.slug}`"
            class="category-card"
          >
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <div class="category-stats">
              <span>{{ category.postsCount }} 个帖子</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 热门帖子 -->
    <section class="hot-posts">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">热门讨论</h2>
          <router-link to="/forum" class="view-all-link">查看全部</router-link>
        </div>
        <div class="posts-grid">
          <div v-for="post in hotPosts" :key="post.id" class="post-card">
            <div class="post-header">
              <div class="post-meta">
                <img :src="post.author.avatar" :alt="post.author.username" class="author-avatar" />
                <div class="author-info">
                  <span class="author-name">{{ post.author.username }}</span>
                  <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                </div>
              </div>
              <div class="post-category">
                <span :class="`category-tag category-${post.category}`">{{ post.categoryName }}</span>
              </div>
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>
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
                  <i class="icon-like"></i>
                  {{ post.likes }}
                </span>
              </div>
              <router-link :to="`/post/${post.id}`" class="read-more">
                阅读更多
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新电影推荐 -->
    <section class="movie-recommendations">
      <div class="container">
        <h2 class="section-title">最新电影推荐</h2>
        <div class="movies-slider">
          <div class="movie-item" v-for="movie in latestMovies" :key="movie.id">
            <div class="movie-poster">
              <img :src="movie.poster" :alt="movie.title" />
              <div class="movie-overlay">
                <button class="play-btn">
                  <i class="icon-play"></i>
                </button>
                <div class="movie-rating">
                  <i class="icon-star"></i>
                  <span>{{ movie.rating }}</span>
                </div>
              </div>
            </div>
            <div class="movie-info">
              <h4 class="movie-title">{{ movie.title }}</h4>
              <p class="movie-genre">{{ movie.genre }}</p>
              <p class="movie-year">{{ movie.year }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalUsers.toLocaleString() }}</div>
            <div class="stat-label">注册用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalPosts.toLocaleString() }}</div>
            <div class="stat-label">讨论帖子</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalComments.toLocaleString() }}</div>
            <div class="stat-label">用户评论</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.onlineUsers.toLocaleString() }}</div>
            <div class="stat-label">在线用户</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Carousel from '../components/Carousel.vue'

// 响应式数据
const featuredMovies = ref([
  {
    id: 1,
    title: '阿凡达：水之道',
    poster: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=200&h=300&fit=crop',
    rating: 8.5
  },
  {
    id: 2,
    title: '流浪地球2',
    poster: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=200&h=300&fit=crop',
    rating: 8.2
  },
  {
    id: 3,
    title: '满江红',
    poster: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=200&h=300&fit=crop',
    rating: 7.8
  }
])

const categories = ref([
  {
    id: 1,
    name: '电影',
    slug: 'movie',
    icon: 'icon-film',
    description: '最新电影评论与讨论',
    postsCount: 1234
  },
  {
    id: 2,
    name: '电视剧',
    slug: 'tv',
    icon: 'icon-tv',
    description: '热播剧集深度解析',
    postsCount: 856
  },
  {
    id: 3,
    name: '动漫',
    slug: 'anime',
    icon: 'icon-anime',
    description: '二次元世界精彩内容',
    postsCount: 567
  },
  {
    id: 4,
    name: '综艺',
    slug: 'variety',
    icon: 'icon-variety',
    description: '娱乐综艺节目讨论',
    postsCount: 234
  }
])

const hotPosts = ref([
  {
    id: 1,
    title: '《流浪地球2》深度解析：中国科幻电影的里程碑',
    excerpt: '作为《流浪地球》的续作，这部电影在视觉效果和故事深度上都有了显著提升...',
    author: {
      username: '科幻迷小王',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    category: 'movie',
    categoryName: '电影',
    views: 1234,
    comments: 89,
    likes: 156,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: '《狂飙》为什么这么火？从剧情到演技全面分析',
    excerpt: '这部扫黑除恶题材的电视剧能够成为现象级作品，背后有哪些成功因素...',
    author: {
      username: '剧评达人',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
    },
    category: 'tv',
    categoryName: '电视剧',
    views: 2156,
    comments: 134,
    likes: 289,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: '《鬼灭之刃》剧场版观后感：热血与感动的完美结合',
    excerpt: '作为鬼灭之刃的忠实粉丝，看完剧场版后内心久久不能平静...',
    author: {
      username: '动漫爱好者',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    category: 'anime',
    categoryName: '动漫',
    views: 987,
    comments: 67,
    likes: 123,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
])

const latestMovies = ref([
  {
    id: 1,
    title: '阿凡达：水之道',
    poster: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=200&h=300&fit=crop',
    genre: '科幻/冒险',
    year: '2022',
    rating: 8.5
  },
  {
    id: 2,
    title: '流浪地球2',
    poster: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=200&h=300&fit=crop',
    genre: '科幻/灾难',
    year: '2023',
    rating: 8.2
  },
  {
    id: 3,
    title: '满江红',
    poster: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=200&h=300&fit=crop',
    genre: '剧情/悬疑',
    year: '2023',
    rating: 7.8
  },
  {
    id: 4,
    title: '深海',
    poster: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=200&h=300&fit=crop',
    genre: '动画/奇幻',
    year: '2023',
    rating: 7.5
  }
])

const stats = ref({
  totalUsers: 125678,
  totalPosts: 45678,
  totalComments: 234567,
  onlineUsers: 1234
})

// 方法
const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (hours > 24) {
    return `${Math.floor(hours / 24)}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else {
    return `${minutes}分钟前`
  }
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 英雄区域
.hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 80px 0;
  display: flex;
  align-items: center;
  min-height: 500px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  z-index: 2;
  position: relative;
}

.hero-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  
  .hero-icon {
    font-size: 4rem;
    animation: bounce 2s infinite;
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  opacity: 0.95;
  line-height: 1.4;
  color: #fbbf24;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-actions {
  display: flex;
  gap: 20px;
  
  .btn {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .btn-icon {
      font-size: 1.2em;
    }
  }
}

.hero-image {
  position: relative;
  height: 400px;
}

.floating-cards {
  position: relative;
  height: 100%;
}

.movie-card {
  position: absolute;
  width: 120px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: float 6s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 20px;
    left: 20px;
  }
  
  &:nth-child(2) {
    top: 60px;
    right: 40px;
  }
  
  &:nth-child(3) {
    bottom: 40px;
    left: 60px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: 15px;
    color: white;
    
    h4 {
      font-size: 12px;
      margin: 0 0 5px 0;
      font-weight: 600;
    }
    
    p {
      font-size: 11px;
      margin: 0;
      color: #fbbf24;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

// 通用样式
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  color: #1f2937;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.view-all-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: #2563eb;
  }
}

// 分类区域
.categories {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.category-card {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .category-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    
    i {
      font-size: 32px;
      color: white;
    }
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #1f2937;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 20px;
    line-height: 1.5;
  }
  
  .category-stats {
    color: var(--primary-color);
    font-weight: 500;
  }
}

// 热门帖子
.hot-posts {
  padding: 80px 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
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
    font-size: 14px;
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
}

.post-content {
  margin-bottom: 20px;
  
  .post-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 10px;
    line-height: 1.4;
  }
  
  .post-excerpt {
    color: #6b7280;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

.read-more {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  
  &:hover {
    color: #2563eb;
  }
}

// 电影推荐
.movie-recommendations {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.movies-slider {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.movie-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
}

.movie-poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  
  .movie-item:hover & {
    opacity: 1;
  }
}

.play-btn {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
  
  i {
    font-size: 20px;
    color: #1f2937;
    margin-left: 3px;
  }
}

.movie-rating {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  
  i {
    color: #fbbf24;
  }
}

.movie-info {
  padding: 20px;
  
  .movie-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 5px;
  }
  
  .movie-genre {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .movie-year {
    color: #9ca3af;
    font-size: 14px;
  }
}

// 统计数据
.stats {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-item {
  .stat-number {
    font-size: 3rem;
    font-weight: 800;
    color: var(--secondary-color);
    margin-bottom: 10px;
  }
  
  .stat-label {
    font-size: 1.1rem;
    color: #d1d5db;
  }
}

// 按钮样式
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  border: 2px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &.btn-primary {
    background: var(--primary-color);
    color: white;
    
    &:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }
  }
  
  &.btn-outline {
    background: transparent;
    color: white;
    border-color: white;
    
    &:hover {
      background: white;
      color: var(--primary-color);
    }
  }
  
  &.btn-lg {
    padding: 16px 32px;
    font-size: 1.1rem;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .movies-slider {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 60px 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

// 动画效果
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
