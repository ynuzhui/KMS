<template>
  <div class="app">
    <!-- 头部导航 -->
    <Header />

    <!-- 主内容区 -->
    <main class="app-main">
      <div class="main-container">
        <!-- 向导组件 -->
        <ActivationWizard />
      </div>
    </main>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import ActivationWizard from './components/ActivationWizard.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ========================================
   Main Content
   ======================================== */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.main-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 640px) {
  .app-main {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
