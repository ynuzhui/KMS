<script setup>
import { ref, computed, onMounted } from 'vue'
import { OFFICE_PRODUCTS, OFFICE_VERSIONS, generateOfficeScript } from './data/officeData'
import { WINDOWS_PRODUCTS, WINDOWS_VERSIONS, WINDOWS_KMS_KEYS, generateWindowsScript } from './data/windowsData'


const softwareCategory = ref('') // 大类: windows 或 office
const majorVersion = ref('')     // 大版本: 如 win10, office2021
const specificVersion = ref('')  // 具体版本: 如 pro, enterprise
const generatedScript = ref('')
const showNotification = ref(false)
const notificationMessage = ref('')
const showAboutModal = ref(false)
const showWindowsDownloadModal = ref(false)




const icpNumber = ref(import.meta.env.VITE_APP_ICP_NUMBER || '')
const policeNumber = ref(import.meta.env.VITE_APP_POLICE_NUMBER || '')


const majorVersions = computed(() => {
  if (!softwareCategory.value) return {}
  
  if (softwareCategory.value === 'windows') {
    
    return {
      'win11': 'Windows 11',
      'win10': 'Windows 10',
      'win11_ltsc_2024': 'Windows 11 LTSC 2024',
      'win10_ltsc_2021': 'Windows 10 LTSC 2021',
      'win10_ltsc_2019': 'Windows 10 LTSC 2019',
      'win_iot_ltsc': 'Windows IoT LTSC',
      'win10_ltsb_2016': 'Windows 10 LTSB 2016',
      'win10_ltsb_2015': 'Windows 10 LTSB 2015',
      'win81': 'Windows 8.1',
      'win8': 'Windows 8',
      'win7': 'Windows 7',
      'winVista': 'Windows Vista',
      'winServer2025': 'Windows Server 2025',
      'winServer2022': 'Windows Server 2022',
      'winServer2019': 'Windows Server 2019',
      'winServer2016': 'Windows Server 2016',
      'winServer20H2': 'Windows Server 版本 20H2',
      'winServer2004': 'Windows Server 版本 2004',
      'winServer1909': 'Windows Server 版本 1909',
      'winServer1903': 'Windows Server 版本 1903',
      'winServer1809': 'Windows Server 版本 1809',
      'winServer1803': 'Windows Server 版本 1803',
      'winServer1709': 'Windows Server 版本 1709',
      'winServer2012R2': 'Windows Server 2012 R2',
      'winServer2012': 'Windows Server 2012',
      'winServer2008R2': 'Windows Server 2008 R2',
      'winServer2008': 'Windows Server 2008'
    }
  }
  return {};
})

const specificVersions = computed(() => {
  if (!softwareCategory.value || !majorVersion.value) return {};
  
  if (softwareCategory.value === 'windows') {
    
    
    switch (majorVersion.value) {
      case 'win11_ltsc_2024':
      case 'win10_ltsc_2021':
      case 'win10_ltsc_2019':
      case 'win_iot_ltsc':
      case 'win10_ltsb_2016':
      case 'win10_ltsb_2015':
        
        return WINDOWS_VERSIONS['win10'] || {};
      default:
        
        return WINDOWS_VERSIONS[majorVersion.value] || {};
    }
  } else if (softwareCategory.value === 'office') {
    
    return OFFICE_VERSIONS[majorVersion.value] || {};
  }
  return {};
})

const isScriptGenerated = computed(() => generatedScript.value.length > 0)


const handleCategoryChange = () => {
  majorVersion.value = ''
  specificVersion.value = ''
  generatedScript.value = ''
}

const handleMajorVersionChange = () => {
  specificVersion.value = ''
  generatedScript.value = ''
}

const handleSpecificVersionChange = () => {
  if (softwareCategory.value && majorVersion.value && specificVersion.value) {
    try {
      if (softwareCategory.value === 'windows') {
        
        let baseVersion = majorVersion.value;
        
        if (majorVersion.value === 'win11_ltsc_2024') {
          baseVersion = 'win11'; // 使用Windows 11的密钥
        } else if (['win10_ltsc_2021', 'win10_ltsc_2019', 'win_iot_ltsc', 'win10_ltsb_2016', 'win10_ltsb_2015'].includes(majorVersion.value)) {
          baseVersion = 'win10'; // 使用Windows 10的密钥
        }
        
        
        generatedScript.value = generateWindowsScript(baseVersion, specificVersion.value)
      } else if (softwareCategory.value === 'office') {
        
        generatedScript.value = generateOfficeScript(majorVersion.value, specificVersion.value)
      }
      
      if (!generatedScript.value) {
        throw new Error('无法生成脚本，请检查选择的版本是否正确')
      }
    } catch (error) {
      showNotification.value = true
      notificationMessage.value = error.message || '生成脚本时出错'
      setTimeout(() => {
        showNotification.value = false
      }, 3000)
    }
  } else {
    generatedScript.value = ''
  }
}

const generateScript = () => {
    if (!softwareCategory.value || !majorVersion.value || !specificVersion.value) {
    showNotification.value = true
    notificationMessage.value = '请先完成所有选项的选择'
    setTimeout(() => {
      showNotification.value = false
    }, 5000)
    return
  }
  
  try {
    if (softwareCategory.value === 'windows') {
      
      let baseVersion = majorVersion.value;
      
      if (majorVersion.value === 'win11_ltsc_2024') {
        baseVersion = 'win11'; // 使用Windows 11的密钥
      } else if (['win10_ltsc_2021', 'win10_ltsc_2019', 'win_iot_ltsc', 'win10_ltsb_2016', 'win10_ltsb_2015'].includes(majorVersion.value)) {
        baseVersion = 'win10'; // 使用Windows 10的密钥
      }
      
      
      generatedScript.value = generateWindowsScript(baseVersion, specificVersion.value)
    } else if (softwareCategory.value === 'office') {
      
      generatedScript.value = generateOfficeScript(majorVersion.value, specificVersion.value)
    }
    
    if (!generatedScript.value) {
      throw new Error('无法生成脚本，请检查选择的版本是否正确')
    }
  } catch (error) {
    showNotification.value = true
    notificationMessage.value = error.message || '生成脚本时出错'
    setTimeout(() => {
      showNotification.value = false
    }, 5000)
  }
}

const copyToClipboard = (text = null) => {
  
  const content = (text && text.type === 'click') ? generatedScript.value : (text || generatedScript.value)
  if (content) {
    navigator.clipboard.writeText(content)
    
    
    showNotification.value = true
    notificationMessage.value = '已复制到剪贴板'
    setTimeout(() => {
      showNotification.value = false
    }, 5000)
  }
}


const getCurrentProductKey = () => {
  if (softwareCategory.value === 'windows' && majorVersion.value && specificVersion.value) {
    
    let baseVersion = majorVersion.value;
    if (majorVersion.value === 'win11_ltsc_2024') {
      baseVersion = 'win11';
    } else if (['win10_ltsc_2021', 'win10_ltsc_2019', 'win_iot_ltsc', 'win10_ltsb_2016', 'win10_ltsb_2015'].includes(majorVersion.value)) {
      baseVersion = 'win10';
    }
    return WINDOWS_KMS_KEYS[baseVersion]?.[specificVersion.value] || '';
  }
  return '';
}


const copyProductKey = () => {
  const key = getCurrentProductKey();
  if (key) {
    copyToClipboard(key);
  }
}

const downloadScript = () => {
  if (generatedScript.value) {
    
    const blob = new Blob([generatedScript.value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const softwareName = softwareCategory.value === 'windows' ? 'Windows' : 'Office'
    const fileName = `${softwareName}_${majorVersion.value}_${specificVersion.value}_激活脚本.bat`
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showNotification.value = true
    notificationMessage.value = '脚本已下载'
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
}
</script>

<template>
  <header>
    <div class="container">
      <h1>KMS激活工具</h1>
      <nav>
        <ul>
          <li><a href="#" @click="showWindowsDownloadModal = true">Windows下载</a></li>
          <li><a href="#" @click="showAboutModal = true">关于</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main>
    <section class="selection-container">
      <h2>选择您需要激活的软件</h2>
      
      <div class="form-group">
        <select 
          id="softwareCategory" 
          v-model="softwareCategory" 
          @change="handleCategoryChange"
          aria-label="软件类别"
        >
          <option value="">请选择软件类别</option>
          <option value="windows">Windows</option>
        </select>
      </div>
      
      <!-- 第二个选择框：大版本 -->
      <transition name="fade">
        <div class="form-group" v-if="softwareCategory && Object.keys(majorVersions).length > 0">
          <select 
            id="majorVersion" 
            v-model="majorVersion" 
            @change="handleMajorVersionChange"
            :disabled="!softwareCategory"
            aria-label="大版本"
          >
            <option value="">请选择大版本</option>
            <option 
              v-for="(name, key) in majorVersions" 
              :key="key" 
              :value="key"
            >
              {{ name }}
            </option>
          </select>
        </div>
      </transition>
      
      <!-- 第三个选择框：具体版本 -->
      <transition name="fade">
        <div class="form-group" v-if="majorVersion && Object.keys(specificVersions).length > 0">
          <select 
            id="specificVersion" 
            v-model="specificVersion" 
            @change="handleSpecificVersionChange"
            :disabled="!majorVersion"
            aria-label="具体版本"
          >
            <option value="">请选择具体版本</option>
            <option 
              v-for="(name, key) in specificVersions" 
              :key="key" 
              :value="key"
            >
              {{ name }}
            </option>
          </select>
        </div>
      </transition>
      
      <!-- 自动生成脚本，无需按钮 -->
    </section>
    
    <section class="script-container" v-if="isScriptGenerated">
      <pre><code>{{ generatedScript }}</code></pre>
      <div class="script-actions">
        <button class="action-btn" @click="copyProductKey">
          复制密钥
        </button>
        <button class="action-btn" @click="copyToClipboard">
          复制脚本
        </button>
        <button class="action-btn" @click="downloadScript">
          下载脚本
        </button>
      </div>
  </section>
</main>

  <footer>
    <p>Copyright By <a href="https://yunzhui.top" target="_blank" style="color: inherit; text-decoration: none;">云坠</a> <span v-if="icpNumber"><a :href="'https://beian.miit.gov.cn/'" target="_blank" style="color: inherit; text-decoration: none;">{{ icpNumber }}</a></span> <span v-if="policeNumber" class="police-badge"><a :href="`https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${policeNumber}`" target="_blank" style="color: inherit; text-decoration: none;">{{ policeNumber }}</a></span></p>
  </footer>
  
  <div class="notification" v-if="showNotification" @click="showNotification = false">
    {{ notificationMessage }}
  </div>
  
  <!-- 已删除Office安装指南弹窗 -->
  
  <!-- 关于弹窗 -->
  <div class="modal" v-if="showAboutModal" @click="showAboutModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>关于KMS激活工具</h3>
        <button class="close-btn" @click="showAboutModal = false">&times;</button>
      </div>
      <div class="modal-body">

        <p style="margin-top: 16px;">KMS的正式名称为Microsoft 通用批量许可证密钥 (GVLK)，是微软提供给企业内部用户的激活系统的方式，区别于零售版。</p>
        <p style="margin-top: 16px;">通过KMS激活的系统与零售版功能上无任何区分，唯一要注意的就是激活最长180天有效，需要保证网络连接以自动续期。</p>
      </div>
    </div>
  </div>
  
  <!-- Windows下载弹窗 -->
  <div class="modal" v-if="showWindowsDownloadModal" @click="showWindowsDownloadModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Windows下载</h3>
        <button class="close-btn" @click="showWindowsDownloadModal = false">&times;</button>
      </div>
      <div class="modal-body">
        <p>选择您需要下载的Windows版本：</p>
        <ul class="download-list">
          <li>
            <a href="https://www.microsoft.com/zh-cn/software-download/windows11" target="_blank" class="download-link">
              <span class="version-name">Windows 11</span>
              <span class="download-btn">下载</span>
            </a>
          </li>
          <li>
            <a href="https://www.microsoft.com/zh-cn/software-download/windows10" target="_blank" class="download-link">
              <span class="version-name">Windows 10</span>
              <span class="download-btn">下载</span>
            </a>
          </li>
          <li>
            <a href="https://www.microsoft.com/zh-cn/software-download/windows7" target="_blank" class="download-link">
              <span class="version-name">Windows 7</span>
              <span class="download-btn">下载</span>
            </a>
          </li>
        </ul>
        <p class="download-note">注意：请确保从官方渠道下载Windows系统，以保证系统安全和稳定性。</p>
      </div>
    </div>
  </div>
  
  <!-- 已删除Office下载弹窗 -->
</template>

<style scoped>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 20px;
  color: #666;
  line-height: 1.6;
}

.modal-body p {
  margin: 0;
}


.download-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.download-list li {
  margin-bottom: 10px;
}

.download-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.3s ease;
}

.download-link:hover {
  background-color: #e9ecef;
}

.version-name {
  font-weight: 500;
  color: #333;
}

.download-btn {
  background-color: #007bff;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.download-link:hover .download-btn {
  background-color: #0056b3;
}

.download-note {
  font-size: 14px;
  color: #6c757d;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eaeaea;
}


.office-notice {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  color: #856404;
  line-height: 1.6;
}

.office-section {
  margin-bottom: 24px;
}

.office-section h4 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #333;
  display: flex;
  align-items: center;
}

.office-steps {
  padding-left: 20px;
  margin: 0;
}

.office-steps li {
    margin-bottom: 10px;
    line-height: 1.6;
    color: #495057;
  }

  .office-steps .sub-step {
    margin-left: 20px;
    color: #666;
    font-size: 14px;
    list-style-type: disc;
  }

  
  .version-selector {
    margin-bottom: 16px;
  }

  .version-selector label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }

  .office-version-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background-color: #fff;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }

  .office-version-select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }

  
  .command-display {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 16px;
    margin-top: 16px;
  }

  .command-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .command-header span {
    font-weight: 500;
    color: #333;
  }

  .copy-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .copy-btn:hover {
    background-color: #218838;
  }

  .command-code {
    background-color: #2d3748;
    color: #e2e8f0;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    margin: 0 0 8px 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .command-note {
    font-size: 13px;
    color: #6c757d;
    margin: 0;
    font-style: italic;
  }

  
  @media (max-width: 600px) {
    .command-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .copy-btn {
      align-self: flex-start;
    }
    
    .office-version-select {
      font-size: 13px;
    }
    
    .command-code {
      font-size: 12px;
    }
  }

  .warning {
    color: #dc3545;
    font-weight: 500;
    padding: 12px;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-top: 12px;
  }
  
  
  .notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #28a745;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  
  .install-guide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 200px;
  }
  
  .install-guide p {
    margin-bottom: 24px;
    line-height: 1.8;
    color: #333;
  }
  
  .ok-btn {
    background-color: #6c5ce7;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: center;
  }
  
  .ok-btn:hover {
    background-color: #5a4ccb;
  }
  
  .install-guide p {
    max-width: 500px;
  }
</style>

<style scoped>

</style>
