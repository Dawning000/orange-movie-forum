<template>
  <div class="carousel-container">
    <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div 
        v-for="(slide, index) in slides" 
        :key="index" 
        class="carousel-slide"
        :class="{ active: index === currentIndex }"
      >
        <div class="slide-image">
          <img :src="slide.image" :alt="slide.title" />
          <div class="slide-overlay"></div>
        </div>
        <div class="slide-content">
          <div class="container">
            <div class="content-wrapper">
              <div class="slide-header">
                <span v-if="slide.icon" class="slide-icon">{{ slide.icon }}</span>
                <h2 class="slide-title">{{ slide.title }}</h2>
              </div>
              <h3 v-if="slide.subtitle" class="slide-subtitle">{{ slide.subtitle }}</h3>
              <p class="slide-description">{{ slide.description }}</p>
              <div class="slide-actions">
                <router-link :to="slide.link" class="btn btn-primary btn-lg">
                  {{ slide.buttonText }}
                </router-link>
                <button class="btn btn-outline btn-lg" @click="playTrailer(slide)">
                  <i class="icon-play"></i>
                  观看预告片
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航点 -->
    <div class="carousel-dots">
      <button 
        v-for="(slide, index) in slides" 
        :key="index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></button>
    </div>

    <!-- 导航箭头 -->
    <button class="carousel-nav prev" @click="prevSlide">
      <i class="icon-arrow-left"></i>
    </button>
    <button class="carousel-nav next" @click="nextSlide">
      <i class="icon-arrow-right"></i>
    </button>

    <!-- 自动播放指示器 -->
    <div class="autoplay-indicator" v-if="autoplay">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentIndex = ref(0)
const autoplay = ref(true)
const progress = ref(0)
const autoplayInterval = ref(null)
const progressInterval = ref(null)

// 轮播图数据
const slides = ref([
  {
    id: 1,
    title: '橘橙影志',
    subtitle: '橘橙暖时光，影志话悠长',
    description: '在这个温暖的橘橙色调中，我们一起分享电影的美好时光，记录每一个动人的瞬间。',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80',
    link: '/forum',
    buttonText: '开始探索',
    trailer: 'https://example.com/trailer1',
    icon: '🍊'
  },
  {
    id: 2,
    title: '流浪地球2',
    subtitle: '科幻巨制，震撼来袭',
    description: '人类为了生存，启动"移山计划"，建造万座行星发动机推动地球离开太阳系。',
    image: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=1920&h=1080&fit=crop',
    link: '/forum/movie',
    buttonText: '立即讨论',
    trailer: 'https://example.com/trailer1',
    icon: '🎬'
  },
  {
    id: 3,
    title: '狂飙',
    subtitle: '扫黑风暴下的正义与人性',
    description: '一部扫黑除恶题材的电视剧，展现正义与邪恶的较量，人性的复杂与救赎。',
    image: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=1920&h=1080&fit=crop',
    link: '/forum/tv',
    buttonText: '追剧讨论',
    trailer: 'https://example.com/trailer2',
    icon: '📺'
  },
  {
    id: 4,
    title: '鬼灭之刃',
    subtitle: '刀光剑影，热血沸腾',
    description: '大正时代，少年炭治郎为了拯救变成鬼的妹妹，踏上了斩鬼之路的冒险故事。',
    image: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=1920&h=1080&fit=crop',
    link: '/forum/anime',
    buttonText: '动漫讨论',
    trailer: 'https://example.com/trailer3',
    icon: '⚔️'
  },
  {
    id: 5,
    title: '阿凡达：水之道',
    subtitle: '潘多拉星球的奇幻之旅',
    description: '杰克·萨利与纳威族人在潘多拉星球上展开的全新冒险，探索海洋的奥秘。',
    image: 'https://images.unsplash.com/photo-1489599808000-0b2b0b2b0b2b?w=1920&h=1080&fit=crop',
    link: '/forum/movie',
    buttonText: '科幻讨论',
    trailer: 'https://example.com/trailer4',
    icon: '🌊'
  }
])

// 方法
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
  resetAutoplay()
}

const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? slides.value.length - 1 : currentIndex.value - 1
  resetAutoplay()
}

const goToSlide = (index) => {
  currentIndex.value = index
  resetAutoplay()
}

const playTrailer = (slide) => {
  // 模拟播放预告片
  alert(`播放 ${slide.title} 的预告片`)
}

const startAutoplay = () => {
  if (!autoplay.value) return
  
  autoplayInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
  
  startProgress()
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
}

const resetAutoplay = () => {
  stopAutoplay()
  progress.value = 0
  startAutoplay()
}

const startProgress = () => {
  progress.value = 0
  progressInterval.value = setInterval(() => {
    progress.value += 2 // 5秒内完成，每50ms增加1%
    if (progress.value >= 100) {
      progress.value = 0
    }
  }, 100)
}

// 生命周期
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style lang="scss" scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.carousel-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  position: relative;
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: 2;
}

.slide-content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 20px;
}

.slide-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  
  .slide-icon {
    font-size: 4rem;
    animation: bounce 2s infinite;
    
    @media (max-width: 768px) {
      font-size: 3rem;
    }
    
    @media (max-width: 480px) {
      font-size: 2.5rem;
    }
  }
}

.slide-title {
  font-size: 4rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
}

.slide-subtitle {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.4;
  color: #fbbf24;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
}

.slide-description {
  font-size: 1.5rem;
  margin-bottom: 40px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.6;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 25px;
  }
}

.slide-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
}

// 导航点
.carousel-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 4;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color);
    background: rgba(255, 255, 255, 0.3);
  }
  
  &.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    transform: scale(1.2);
  }
}

// 导航箭头
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-50%) scale(1.1);
  }
  
  &.prev {
    left: 30px;
  }
  
  &.next {
    right: 30px;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 16px;
    
    &.prev {
      left: 20px;
    }
    
    &.next {
      right: 20px;
    }
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
    
    &.prev {
      left: 15px;
    }
    
    &.next {
      right: 15px;
    }
  }
}

// 自动播放指示器
.autoplay-indicator {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  z-index: 4;
}

.progress-bar {
  width: 100%;
  height: 100%;
  position: relative;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width 0.1s linear;
}

// 按钮样式
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  
  &.btn-primary {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    
    &:hover {
      background: var(--primary-dark);
      border-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
    }
  }
  
  &.btn-outline {
    background: transparent;
    color: white;
    border-color: rgba(255, 255, 255, 0.8);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
      transform: translateY(-2px);
    }
  }
  
  &.btn-lg {
    padding: 16px 32px;
    font-size: 18px;
    
    @media (max-width: 480px) {
      padding: 14px 28px;
      font-size: 16px;
    }
  }
}

// 动画效果
.carousel-slide {
  &.active {
    .slide-title {
      animation: slideInUp 0.8s ease-out;
    }
    
    .slide-description {
      animation: slideInUp 0.8s ease-out 0.2s both;
    }
    
    .slide-actions {
      animation: slideInUp 0.8s ease-out 0.4s both;
    }
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .carousel-container {
    height: 80vh;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    height: 70vh;
  }
  
  .content-wrapper {
    max-width: 600px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 60vh;
  }
  
  .content-wrapper {
    max-width: 100%;
    padding: 0 15px;
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
