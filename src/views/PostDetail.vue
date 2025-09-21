<template>
  <div class="post-detail">
    <div class="container">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="post" class="post-content">
        <!-- 帖子头部 -->
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
          <div class="post-actions">
            <button class="action-btn" @click="handleBookmark">
              <i class="icon-bookmark" :class="{ active: post.isBookmarked }"></i>
              收藏
            </button>
            <button class="action-btn" @click="handleShare">
              <i class="icon-share"></i>
              分享
            </button>
          </div>
        </div>

        <!-- 帖子内容 -->
        <div class="post-body">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-tags" v-if="post.tags && post.tags.length > 0">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="post-text" v-html="formatContent(post.content)"></div>
        </div>

        <!-- 帖子统计 -->
        <div class="post-stats">
          <div class="stat-item">
            <i class="icon-eye"></i>
            <span>{{ post.views }} 次浏览</span>
          </div>
          <div class="stat-item">
            <i class="icon-comment"></i>
            <span>{{ post.comments }} 条评论</span>
          </div>
          <div class="stat-item">
            <i class="icon-like"></i>
            <span>{{ post.likes }} 个赞</span>
          </div>
        </div>

        <!-- 投票区域 -->
        <div class="post-voting">
          <button class="vote-btn upvote" :class="{ active: userVote === 'up' }" @click="handleVote('up')">
            <i class="icon-arrow-up"></i>
            赞同
          </button>
          <span class="vote-count">{{ post.votes }}</span>
          <button class="vote-btn downvote" :class="{ active: userVote === 'down' }" @click="handleVote('down')">
            <i class="icon-arrow-down"></i>
            反对
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <div class="comments-header">
          <h3>评论 ({{ comments.length }})</h3>
          <button class="btn btn-primary" @click="showCommentForm = !showCommentForm">
            <i class="icon-plus"></i>
            发表评论
          </button>
        </div>

        <!-- 评论表单 -->
        <div v-if="showCommentForm" class="comment-form">
          <div class="form-group">
            <textarea 
              v-model="newComment"
              placeholder="写下你的想法..."
              rows="4"
              class="comment-textarea"
            ></textarea>
          </div>
          <div class="form-actions">
            <button class="btn btn-outline" @click="showCommentForm = false">
              取消
            </button>
            <button class="btn btn-primary" @click="handleSubmitComment" :disabled="submitting">
              {{ submitting ? '提交中...' : '发表评论' }}
            </button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <img :src="comment.author.avatar" :alt="comment.author.username" class="comment-avatar" />
              <div class="comment-meta">
                <span class="comment-author">{{ comment.author.username }}</span>
                <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <div class="comment-actions">
                <button class="action-btn" @click="handleReply(comment)">
                  <i class="icon-reply"></i>
                  回复
                </button>
              </div>
            </div>
            <div class="comment-content" v-html="formatContent(comment.content)"></div>
            <div class="comment-voting">
              <button class="vote-btn" :class="{ active: comment.userVote === 'up' }" @click="handleCommentVote(comment, 'up')">
                <i class="icon-arrow-up"></i>
                {{ comment.votes }}
              </button>
              <button class="vote-btn" :class="{ active: comment.userVote === 'down' }" @click="handleCommentVote(comment, 'down')">
                <i class="icon-arrow-down"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 响应式数据
const loading = ref(true)
const post = ref(null)
const comments = ref([])
const userVote = ref(null)
const showCommentForm = ref(false)
const newComment = ref('')
const submitting = ref(false)

// 方法
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

const formatContent = (content) => {
  // 简单的格式化，实际项目中可以使用markdown解析器
  return content.replace(/\n/g, '<br>')
}

const loadPost = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    post.value = {
      id: parseInt(route.params.id),
      title: '《流浪地球2》深度解析：中国科幻电影的里程碑',
      content: `作为《流浪地球》的续作，这部电影在视觉效果和故事深度上都有了显著提升。从技术层面来看，影片的特效制作已经达到了国际先进水平。

影片的故事背景设定在2044年，人类为了应对太阳即将毁灭的危机，启动了"移山计划"和"数字生命计划"。这两个计划代表了人类面对危机时的不同选择，也引发了深刻的哲学思考。

从视觉效果来看，影片的太空场景、行星发动机、月球基地等场景的制作都非常精良，特别是太空电梯的段落，视觉效果震撼人心。

在人物塑造方面，影片通过刘培强、图恒宇等角色的故事，展现了人类在面对生死存亡时的勇气和牺牲精神。

总的来说，《流浪地球2》不仅是一部优秀的科幻电影，更是中国科幻电影发展的重要里程碑。`,
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
      likes: 156,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
    
    comments.value = [
      {
        id: 1,
        content: '分析得很到位！特别是对两个计划的对比分析，很有深度。',
        author: {
          id: 2,
          username: '影评人小李',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
        },
        votes: 23,
        userVote: null,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: 2,
        content: '太空电梯那段确实震撼，IMAX效果更佳！',
        author: {
          id: 3,
          username: '观影达人',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        votes: 15,
        userVote: 'up',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  } finally {
    loading.value = false
  }
}

const handleVote = (type) => {
  if (userVote.value === type) {
    userVote.value = null
    post.value.votes -= type === 'up' ? 1 : -1
  } else {
    const oldVote = userVote.value
    userVote.value = type
    post.value.votes += type === 'up' ? 1 : -1
    if (oldVote) {
      post.value.votes += oldVote === 'up' ? -1 : 1
    }
  }
}

const handleBookmark = () => {
  post.value.isBookmarked = !post.value.isBookmarked
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: post.value.title,
      text: post.value.content.substring(0, 100),
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

const handleSubmitComment = async () => {
  if (!newComment.value.trim()) return
  
  submitting.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const comment = {
      id: Date.now(),
      content: newComment.value,
      author: {
        id: 1,
        username: '当前用户',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      votes: 0,
      userVote: null,
      createdAt: new Date()
    }
    
    comments.value.unshift(comment)
    post.value.comments++
    newComment.value = ''
    showCommentForm.value = false
  } finally {
    submitting.value = false
  }
}

const handleReply = (comment) => {
  // 实现回复功能
  console.log('回复评论:', comment.id)
}

const handleCommentVote = (comment, type) => {
  if (comment.userVote === type) {
    comment.userVote = null
    comment.votes -= type === 'up' ? 1 : -1
  } else {
    const oldVote = comment.userVote
    comment.userVote = type
    comment.votes += type === 'up' ? 1 : -1
    if (oldVote) {
      comment.votes += oldVote === 'up' ? -1 : 1
    }
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style lang="scss" scoped>
.post-detail {
  min-height: 100vh;
  background: #f9fafb;
  padding: 40px 0;
}

.container {
  max-width: 800px;
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

.post-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
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
    font-size: 16px;
    
    &:hover {
      color: #3b82f6;
    }
  }
  
  .post-time {
    color: #9ca3af;
    font-size: 14px;
  }
}

.post-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  
  &:hover {
    background: #f3f4f6;
  }
  
  i.active {
    color: #3b82f6;
  }
}

.post-body {
  margin-bottom: 30px;
}

.post-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  line-height: 1.3;
}

.post-tags {
  margin-bottom: 25px;
  
  .tag {
    display: inline-block;
    padding: 6px 12px;
    background: #f3f4f6;
    color: #6b7280;
    border-radius: 16px;
    font-size: 14px;
    margin-right: 10px;
    margin-bottom: 8px;
  }
}

.post-text {
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  
  :deep(br) {
    margin-bottom: 10px;
  }
}

.post-stats {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  
  i {
    color: #9ca3af;
  }
}

.post-voting {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  padding: 20px 0;
}

.vote-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  &.upvote.active {
    background: #10b981;
    border-color: #10b981;
  }
  
  &.downvote.active {
    background: #ef4444;
    border-color: #ef4444;
  }
}

.vote-count {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  min-width: 40px;
  text-align: center;
}

// 评论区
.comments-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  
  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }
}

.comment-form {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.comments-list {
  .comment-item {
    padding: 20px 0;
    border-bottom: 1px solid #f3f4f6;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.comment-meta {
  flex: 1;
  
  .comment-author {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
  }
  
  .comment-time {
    color: #9ca3af;
    font-size: 12px;
    margin-left: 10px;
  }
}

.comment-content {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #374151;
}

.comment-voting {
  display: flex;
  gap: 10px;
  
  .vote-btn {
    padding: 6px 12px;
    font-size: 12px;
    
    &.active {
      background: #3b82f6;
      color: white;
    }
  }
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
  .container {
    padding: 0 15px;
  }
  
  .post-content {
    padding: 25px;
  }
  
  .post-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .post-voting {
    flex-direction: column;
    gap: 15px;
  }
  
  .comments-section {
    padding: 20px;
  }
  
  .comments-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .comment-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .comment-meta {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
