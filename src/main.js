import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

// 动态设置页面标题和 meta 信息
document.title = import.meta.env.VITE_SITE_TITLE || 'KMS 激活脚本生成器'

// 设置 meta description
const metaDesc = document.createElement('meta')
metaDesc.name = 'description'
metaDesc.content = import.meta.env.VITE_SITE_DESC || ''
document.head.appendChild(metaDesc)

// 设置 meta keywords
const metaKeywords = document.createElement('meta')
metaKeywords.name = 'keywords'
metaKeywords.content = import.meta.env.VITE_SITE_KEYWORDS || ''
document.head.appendChild(metaKeywords)

createApp(App).mount('#app')
