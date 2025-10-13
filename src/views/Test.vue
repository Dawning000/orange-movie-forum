<!-- src/views/TestNavbar.vue -->
<template>
  <!-- 只放目标组件，不引入其他无关内容 -->
  <NavBar />
</template>

<script setup>
// 仅导入要测试的组件
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Carousel from '../components/Carousel.vue'






</script>

<!-- 可选：添加测试所需的样式 -->
<style scoped>
/* 如需调整测试环境样式，可在此添加 */
</style>