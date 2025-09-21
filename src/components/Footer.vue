<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 网站信息 -->
        <div class="footer-section">
          <div class="footer-brand">
            <i class="icon-orange"></i>
            <span>橘橙影志</span>
          </div>
          <p class="footer-description">
            橘橙暖时光，影志话悠长。在这个温暖的橘橙色调中，我们一起分享电影的美好时光，
            记录每一个动人的瞬间，与志同道合的影迷一起探讨精彩内容。
          </p>
          <div class="social-links">
            <a href="#" class="social-link" title="微博">
              <i class="icon-weibo"></i>
            </a>
            <a href="#" class="social-link" title="微信">
              <i class="icon-wechat"></i>
            </a>
            <a href="#" class="social-link" title="QQ">
              <i class="icon-qq"></i>
            </a>
            <a href="#" class="social-link" title="GitHub">
              <i class="icon-github"></i>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="footer-section">
          <h4 class="footer-title">快速导航</h4>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/forum">论坛</router-link></li>
            <li><router-link to="/forum/movie">电影</router-link></li>
            <li><router-link to="/forum/tv">电视剧</router-link></li>
            <li><router-link to="/forum/anime">动漫</router-link></li>
            <li><router-link to="/forum/variety">综艺</router-link></li>
          </ul>
        </div>

        <!-- 帮助中心 -->
        <div class="footer-section">
          <h4 class="footer-title">帮助中心</h4>
          <ul class="footer-links">
            <li><a href="#">使用指南</a></li>
            <li><a href="#">社区规则</a></li>
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">服务条款</a></li>
            <li><a href="#">意见反馈</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>

        <!-- 热门标签 -->
        <div class="footer-section">
          <h4 class="footer-title">热门标签</h4>
          <div class="footer-tags">
            <span class="tag">科幻电影</span>
            <span class="tag">悬疑剧</span>
            <span class="tag">爱情片</span>
            <span class="tag">动作片</span>
            <span class="tag">喜剧</span>
            <span class="tag">古装剧</span>
            <span class="tag">韩剧</span>
            <span class="tag">美剧</span>
            <span class="tag">日剧</span>
            <span class="tag">国产剧</span>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © 2024 影视论坛. 保留所有权利.
          </p>
          <div class="footer-stats">
            <span>在线用户: {{ onlineUsers }}</span>
            <span>今日发帖: {{ todayPosts }}</span>
            <span>总帖子数: {{ totalPosts }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const onlineUsers = ref(0)
const todayPosts = ref(0)
const totalPosts = ref(0)

onMounted(() => {
  // 模拟数据，实际项目中应该从API获取
  onlineUsers.value = Math.floor(Math.random() * 1000) + 500
  todayPosts.value = Math.floor(Math.random() * 100) + 50
  totalPosts.value = Math.floor(Math.random() * 10000) + 50000
})
</script>

<style lang="scss" scoped>
.footer {
  background: #1f2937;
  color: #d1d5db;
  margin-top: 60px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 60px 0 40px;
}

.footer-section {
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
    
    .icon-film {
      font-size: 24px;
      color: var(--primary-color);
    }
  }
  
  .footer-description {
    line-height: 1.6;
    margin-bottom: 20px;
    color: #9ca3af;
  }
  
  .social-links {
    display: flex;
    gap: 12px;
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #374151;
      border-radius: 8px;
      color: #d1d5db;
      text-decoration: none;
      transition: all 0.2s;
      
      &:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
      }
    }
  }
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 8px;
    
    a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
}

.footer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .tag {
    padding: 4px 12px;
    background: #374151;
    border-radius: 16px;
    font-size: 12px;
    color: #d1d5db;
    transition: all 0.2s;
    cursor: pointer;
    
    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding: 20px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.copyright {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
}

.footer-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #9ca3af;
  
  span {
    white-space: nowrap;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 40px 0 30px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .footer-stats {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 15px;
  }
  
  .footer-content {
    padding: 30px 0 20px;
  }
  
  .footer-tags {
    .tag {
      font-size: 11px;
      padding: 3px 8px;
    }
  }
}
</style>
