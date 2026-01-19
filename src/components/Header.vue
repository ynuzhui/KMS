<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo 和标题 -->
      <div class="logo-section">
        <img 
          v-if="siteLogo" 
          :src="siteLogo" 
          alt="Logo" 
          class="site-logo"
        />
        <Logo v-else class="site-logo" />
        <h1 class="site-title">{{ siteTitle }}</h1>
      </div>
      
      <!-- 操作按钮 -->
      <div class="header-actions">
        <!-- Windows 下载按钮 -->
        <button class="btn btn-ghost btn-sm" @click="showDownloadModal = true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Windows 下载
        </button>
        
        <!-- 关于按钮 -->
        <button class="btn btn-ghost btn-sm" @click="showAboutModal = true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          关于
        </button>
        
        <!-- 主题切换器 -->
        <div class="theme-switcher">
          <button 
            class="theme-option" 
            :class="{ active: currentTheme === 'light' }"
            @click="setTheme('light')"
            title="浅色模式"
          >
            🌞
          </button>
          <button 
            class="theme-option" 
            :class="{ active: currentTheme === 'dark' }"
            @click="setTheme('dark')"
            title="深色模式"
          >
            🌙
          </button>
          <button 
            class="theme-option" 
            :class="{ active: currentTheme === 'system' }"
            @click="setTheme('system')"
            title="跟随系统"
          >
            💻
          </button>
        </div>
      </div>
    </div>
    
    <!-- Windows 下载模态框 -->
    <Modal v-model="showDownloadModal" title="下载 Windows">
      <p class="modal-desc">选择您需要下载的 Windows 版本，将跳转到微软官方下载页面。</p>
      <div class="download-grid">
        <a 
          href="https://www.microsoft.com/zh-cn/software-download/windows11" 
          target="_blank" 
          rel="noopener noreferrer"
          class="download-card"
        >
          <div class="download-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"/>
            </svg>
          </div>
          <div class="download-info">
            <div class="download-title">Windows 11</div>
            <div class="download-desc">最新版本</div>
          </div>
          <svg class="download-arrow" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </a>
        <a 
          href="https://www.microsoft.com/zh-cn/software-download/windows10" 
          target="_blank" 
          rel="noopener noreferrer"
          class="download-card"
        >
          <div class="download-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"/>
            </svg>
          </div>
          <div class="download-info">
            <div class="download-title">Windows 10</div>
            <div class="download-desc">稳定版本</div>
          </div>
          <svg class="download-arrow" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </a>
      </div>
    </Modal>
    
    <!-- 关于模态框 -->
    <Modal v-model="showAboutModal" title="关于 KMS 激活">
      <div class="about-content">
        <h4>什么是 KMS？</h4>
        <p>
          KMS（Key Management Service，密钥管理服务）是微软为企业和组织提供的一种批量激活解决方案。
          它允许在本地网络中部署一台 KMS 服务器，局域网内的客户端可以通过连接该服务器来完成 Windows 和 Office 产品的激活。
        </p>
        
        <h4>KMS 激活的特点</h4>
        <ul>
          <li><strong>批量授权：</strong>专为企业客户设计，支持大规模部署</li>
          <li><strong>定期续期：</strong>激活有效期为 180 天，期间会自动尝试续期</li>
          <li><strong>无需互联网：</strong>仅需连接内部 KMS 服务器即可完成激活</li>
          <li><strong>合法合规：</strong>是微软官方提供的激活方式之一</li>
        </ul>
        
        <h4>免责声明</h4>
        <p class="disclaimer">
          本工具仅用于生成 KMS 激活脚本，供学习和测试使用。
          请确保您拥有相应产品的合法授权。
          对于任何因使用本工具产生的问题，作者不承担任何责任。
        </p>
      </div>
    </Modal>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Modal from './Modal.vue'
import Logo from './Logo.vue'

// 环境配置
const siteTitle = import.meta.env.VITE_SITE_TITLE || 'KMS 激活脚本生成器'
const siteLogo = import.meta.env.VITE_SITE_LOGO || ''

// 模态框状态
const showDownloadModal = ref(false)
const showAboutModal = ref(false)

// 主题状态
const currentTheme = ref('light')

// 获取系统主题偏好
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题
function applyTheme(theme) {
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.setAttribute('data-theme', effectiveTheme)
}

// 设置主题
function setTheme(theme) {
  currentTheme.value = theme
  localStorage.setItem('theme', theme)
  applyTheme(theme)
}

// 初始化主题
onMounted(() => {
  // 从 localStorage 读取保存的主题，默认为 light
  const savedTheme = localStorage.getItem('theme') || 'light'
  currentTheme.value = savedTheme
  applyTheme(savedTheme)
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme.value === 'system') {
      applyTheme('system')
    }
  })
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur-lg));
  -webkit-backdrop-filter: blur(var(--blur-lg));
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.site-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.site-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-actions .btn-ghost {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
}

[data-theme='dark'] .header-actions .btn-ghost {
  border-color: color-mix(in srgb, var(--color-border) 80%, var(--color-text-primary));
}

.header-actions .btn-ghost:hover {
  border-color: var(--color-text-secondary);
  background: var(--color-surface-hover);
  box-shadow: var(--shadow-md);
}

.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.theme-option {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast), transform var(--transition-fast);
}

.theme-option.active {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
  transform: translateY(-1px);
}

.theme-option:hover {
  border-color: var(--color-text-secondary);
  background: var(--color-surface-hover);
}

/* Modal 内部样式 */
.modal-desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.download-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.download-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.download-card:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
  transform: translateX(4px);
  text-decoration: none;
}

.download-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-subtle);
  border-radius: var(--radius-md);
  color: var(--color-accent);
}

.download-icon svg {
  width: 28px;
  height: 28px;
}

.download-info {
  flex: 1;
}

.download-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.download-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.download-arrow {
  color: var(--color-text-tertiary);
  transition: transform var(--transition-fast);
}

.download-card:hover .download-arrow {
  color: var(--color-accent);
  transform: translateX(4px);
}

/* 关于内容 */
.about-content h4 {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-sm);
}

.about-content h4:first-child {
  margin-top: 0;
}

.about-content p {
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-sm);
}

.about-content ul {
  padding-left: var(--spacing-lg);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.about-content li {
  margin-bottom: var(--spacing-xs);
}

.disclaimer {
  padding: var(--spacing-md);
  background: var(--color-surface-hover);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* 响应式 */
@media (max-width: 768px) {
  .header-content {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .site-title {
    display: none;
  }
  
  .btn-sm {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .btn-sm svg + span,
  .btn-sm span {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-actions .btn-ghost {
    display: none;
  }
  
  .header-actions .btn-ghost:last-of-type {
    display: inline-flex;
  }
}
</style>
