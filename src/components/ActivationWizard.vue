<template>
  <div class="wizard glass-card-elevated slide-up">
    <!-- 步骤指示器 -->
    <div class="wizard-steps">
      <template v-for="(step, index) in steps" :key="step.id">
        <div 
          class="wizard-step"
          :class="{ 
            active: currentStep === index,
            completed: currentStep > index
          }"
        >
          <div class="wizard-step-number">
            <template v-if="currentStep > index">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </template>
            <template v-else>{{ index + 1 }}</template>
          </div>
          <span class="wizard-step-label">{{ step.label }}</span>
        </div>
        <div 
          v-if="index < steps.length - 1" 
          class="wizard-step-line"
          :class="{ completed: currentStep > index }"
        ></div>
      </template>
    </div>

    <!-- 步骤内容 -->
    <div class="wizard-content">
      <!-- 步骤 1: 选择激活类型 -->
      <div v-if="currentStep === 0" class="step-content scale-in">
        <h2 class="step-title">选择激活类型</h2>
        <p class="step-desc">请选择您要激活的产品类型</p>
        
        <div class="selection-grid">
          <div 
            class="selection-card"
            :class="{ active: activationType === 'windows' }"
            @click="selectType('windows')"
          >
            <div class="selection-card-icon windows-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"/>
              </svg>
            </div>
            <div class="selection-card-title">Windows</div>
            <div class="selection-card-desc">激活 Windows 10/11 或 Server</div>
          </div>
          
          <div 
            class="selection-card"
            :class="{ active: activationType === 'office' }"
            @click="selectType('office')"
          >
            <div class="selection-card-icon office-icon">
              <!-- Office Fluent Icon -->
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 2H14L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z" fill="currentColor" opacity="0.2"/>
                <path d="M14 2L20 8H15C14.45 8 14 7.55 14 7V2Z" fill="currentColor" opacity="0.4"/>
                <path d="M8 12H16M8 15H16M8 18H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="6" y="9" width="4" height="4" rx="0.5" fill="#D35230"/>
                <path d="M7.2 10.5H8.8L8 12.5L7.2 10.5Z" fill="white"/>
              </svg>
            </div>
            <div class="selection-card-title">Office</div>
            <div class="selection-card-desc">激活 Office 2016/2019/2021/2024</div>
          </div>
        </div>
      </div>

      <!-- 步骤 2: 选择版本 -->
      <div v-if="currentStep === 1" class="step-content scale-in">
        <h2 class="step-title">选择产品版本</h2>
        <p class="step-desc">
          {{ activationType === 'windows' ? '选择您的 Windows 版本' : '选择您的 Office 版本' }}
        </p>
        
        <div class="form-group">
          <label class="form-label">产品分类</label>
          <select 
            v-model="selectedCategory" 
            class="form-select"
            @change="selectedVersion = ''"
          >
            <option value="">-- 请选择分类 --</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
        
        <div v-if="selectedCategory" class="form-group mt-lg">
          <label class="form-label">产品版本</label>
          <select v-model="selectedVersion" class="form-select">
            <option value="">-- 请选择版本 --</option>
            <option 
              v-for="product in filteredProducts" 
              :key="product.key" 
              :value="product.key"
            >
              {{ product.version }}
            </option>
          </select>
        </div>
        
      </div>

      <!-- 步骤 3: 生成脚本 -->
      <div v-if="currentStep === 2" class="step-content scale-in">
        <h2 class="step-title">生成激活脚本</h2>
        <p class="step-desc">脚本已准备就绪</p>

        <!-- 显示激活命令 -->
        <div class="code-block mt-lg">
          <div class="code-block-header">
            <span class="code-block-title">激活命令</span>
            <button class="btn btn-ghost btn-icon-sm" @click="copyCommand" title="复制命令">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
          <div class="code-block-content">
            <pre>{{ oneLineCommand }}</pre>
          </div>
        </div>

        <!-- 核心操作按钮 -->
        <div class="action-buttons mt-xl">
          <button class="btn btn-primary btn-lg" @click="downloadScript">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            下载激活脚本 (.bat)
          </button>
          <button class="btn btn-outline btn-lg" @click="copyCommand">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            复制命令
          </button>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="wizard-nav">
      <button 
        v-if="currentStep > 0" 
        class="btn" 
        @click="prevStep"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
        上一步
      </button>
      <div v-else></div>
      
      <button 
        v-if="currentStep < steps.length - 1"
        class="btn btn-primary" 
        :disabled="!canProceed"
        @click="nextStep"
      >
        下一步
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
      
      <button 
        v-if="currentStep === steps.length - 1"
        class="btn btn-outline"
        @click="resetWizard"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        重新开始
      </button>
    </div>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  windowsKeys, 
  officeKeys, 
  getWindowsCategories, 
  getOfficeCategories,
  getWindowsKeysByCategory,
  getOfficeKeysByCategory
} from '@/data/keys.js'
import { 
  generateWindowsScript, 
  generateOfficeScript,
  downloadBatFile,
  copyToClipboard,
  generateOneLineCommand
} from '@/utils/scriptGenerator.js'

// 从环境变量获取 KMS 服务器地址
const kmsHost = import.meta.env.VITE_KMS_HOST || 'kms.example.com'

// 步骤定义 (简化为3步)
const steps = [
  { id: 'type', label: '选择类型' },
  { id: 'version', label: '选择版本' },
  { id: 'generate', label: '生成脚本' }
]

// 状态
const currentStep = ref(0)
const activationType = ref('')
const selectedCategory = ref('')
const selectedVersion = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

// 计算属性
const categories = computed(() => {
  if (activationType.value === 'windows') {
    return getWindowsCategories()
  } else if (activationType.value === 'office') {
    return getOfficeCategories()
  }
  return []
})

const filteredProducts = computed(() => {
  if (activationType.value === 'windows') {
    return getWindowsKeysByCategory(selectedCategory.value)
  } else if (activationType.value === 'office') {
    return getOfficeKeysByCategory(selectedCategory.value)
  }
  return []
})

const selectedProductName = computed(() => {
  const products = activationType.value === 'windows' ? windowsKeys : officeKeys
  const product = products.find(p => p.key === selectedVersion.value)
  return product ? product.version : ''
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return !!activationType.value
    case 1:
      return !!selectedVersion.value
    default:
      return true
  }
})

const generatedScript = computed(() => {
  if (!selectedVersion.value) return ''
  
  if (activationType.value === 'windows') {
    return generateWindowsScript(selectedVersion.value, kmsHost, selectedProductName.value)
  } else {
    return generateOfficeScript(selectedVersion.value, kmsHost, selectedProductName.value)
  }
})

const oneLineCommand = computed(() => {
  if (!selectedVersion.value) return ''
  return generateOneLineCommand(activationType.value, selectedVersion.value, kmsHost)
})

// 方法
function selectType(type) {
  activationType.value = type
  selectedCategory.value = ''
  selectedVersion.value = ''
}

function nextStep() {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function resetWizard() {
  currentStep.value = 0
  activationType.value = ''
  selectedCategory.value = ''
  selectedVersion.value = ''
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

function downloadScript() {
  const filename = activationType.value === 'windows' 
    ? 'kms.bat'
    : 'office_kms.bat'
  
  downloadBatFile(generatedScript.value, filename)
  showToast('脚本已下载')
  if (activationType.value === 'windows') {
    window.alert('请右键选择“以管理员身份运行”下载的 kms.bat 即可完成系统激活，期间可能出现黑色窗口几十秒，请耐心等待！')
  } else {
    window.alert('请右键选择“以管理员身份运行”下载的 office_kms.bat 完成 Office 激活，执行过程中可能出现黑色窗口，请耐心等待。')
  }
}

async function copyCommand() {
  const success = await copyToClipboard(oneLineCommand.value)
  showToast(success ? '命令已复制到剪贴板' : '复制失败，请手动复制')
}
</script>

<style scoped>
.wizard {
  padding: var(--spacing-xl);
  position: relative;
}

/* ========================================
   Step Content
   ======================================== */
.wizard-content {
  min-height: 320px;
}

.step-content {
  animation: scaleIn var(--transition-normal) ease;
}

.step-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.step-desc {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

/* ========================================
   Selection Grid
   ======================================== */
.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.selection-card-icon svg {
  width: 48px;
  height: 48px;
}

.windows-icon svg {
  color: var(--color-accent);
}

.office-icon svg {
  color: #D35230;
}

.selection-card.active .windows-icon svg,
.selection-card.active .office-icon svg {
  transform: scale(1.1);
  transition: transform var(--transition-fast);
}

/* ========================================
   Action Buttons
   ======================================== */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.action-buttons .btn {
  flex: 1;
  min-width: 200px;
}

/* ========================================
   Wizard Navigation
   ======================================== */
.wizard-nav {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* ========================================
   Toast
   ======================================== */
.toast {
  position: fixed;
  bottom: var(--spacing-xl);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  z-index: 1000;
}

.toast.success {
  border-color: var(--color-success);
  color: var(--color-success);
}

.toast.error {
  border-color: var(--color-error);
  color: var(--color-error);
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 640px) {
  .wizard {
    padding: var(--spacing-lg);
  }
  
  .step-title {
    font-size: var(--font-size-xl);
  }
  
  .selection-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    min-width: 100%;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
