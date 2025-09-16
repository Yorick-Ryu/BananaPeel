// Initialize and load settings
document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  loadSettings();

  // Set up tab switching
  setupTabs();

  // Restore the last active tab
  restoreLastActiveTab();

  // Set up auto-save functionality
  setupAutoSave();

  // Set up other UI elements
  setupUIElements();

  // Set all i18n text
  loadI18nText();
});

// Function to load saved settings
function loadSettings() {
  chrome.storage.sync.get([
    'serverUrl',
    'selectedModel'
  ], (data) => {
    // Server URL setting
    document.getElementById('serverUrl').value = data.serverUrl || 'http://127.0.0.1:7001';
    
    // Model selection setting
    const modelSelect = document.getElementById('modelSelect');
    if (data.selectedModel) {
      // Check if the saved model exists in the dropdown
      const option = modelSelect.querySelector(`option[value="${data.selectedModel}"]`);
      if (option) {
        modelSelect.value = data.selectedModel;
      }
    }
  });
}

// Set up tab switching functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTabId = button.getAttribute('data-tab');

      // Update active tab button
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      // Show the selected tab content
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      document.getElementById(targetTabId).classList.add('active');

      // Save the active tab ID to chrome.storage.sync
      chrome.storage.sync.set({ 'lastActiveTab': targetTabId });
    });
  });
}

// Function to restore the last active tab
function restoreLastActiveTab() {
  chrome.storage.sync.get(['lastActiveTab'], (data) => {
    if (data.lastActiveTab) {
      // Find the button for this tab
      const tabButton = document.querySelector(`.tab-btn[data-tab="${data.lastActiveTab}"]`);

      if (tabButton) {
        // Simulate a click on the tab button
        tabButton.click();
      }
    }
  });
}

// Set up auto-save functionality
function setupAutoSave() {
  // Get the input elements
  const serverUrlInput = document.getElementById('serverUrl');
  const modelSelect = document.getElementById('modelSelect');

  // Add change event listeners
  serverUrlInput.addEventListener('change', saveSettings);
  serverUrlInput.addEventListener('input', debounce(saveSettings, 500));
  modelSelect.addEventListener('change', saveSettings);
}

// Debounce function to prevent too many saves on text input
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Set up other UI elements
function setupUIElements() {
  // Set up get models button
  const getModelsBtn = document.getElementById('getModels');
  const connectionStatus = document.getElementById('connectionStatus');
  const modelSelect = document.getElementById('modelSelect');

  getModelsBtn.addEventListener('click', async () => {
    const serverUrl = document.getElementById('serverUrl').value.trim();
    
    if (!serverUrl) {
      connectionStatus.textContent = '请输入服务器地址';
      connectionStatus.style.color = 'var(--error-color)';
      return;
    }

    // Show loading state
    getModelsBtn.disabled = true;
    getModelsBtn.textContent = '获取中...';
    connectionStatus.textContent = '';

    try {
      // Get available models from the server
      const response = await fetch(`${serverUrl}/models`, {
        method: 'GET',
        timeout: 10000
      });

      if (response.ok) {
        const data = await response.json();
        
        // Extract models array from response - expecting {"models": [...]} format
        const models = data.models;
        
        // Clear existing options except the default one
        const currentValue = modelSelect.value;
        modelSelect.innerHTML = '';
        
        // Add models to dropdown
        if (Array.isArray(models) && models.length > 0) {
          models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model + (model === 'isnet-general-use' ? ' (默认)' : '');
            modelSelect.appendChild(option);
          });
          
          // Restore previous selection if it still exists
          if (currentValue && models.includes(currentValue)) {
            modelSelect.value = currentValue;
          } else {
            // Set to default if available
            if (models.includes('isnet-general-use')) {
              modelSelect.value = 'isnet-general-use';
            } else if (models.length > 0) {
              modelSelect.value = models[0];
            }
          }
          
          connectionStatus.textContent = `获取成功！找到 ${models.length} 个模型`;
          connectionStatus.style.color = 'var(--primary-color)';
          
          // Save the updated model selection
          saveSettings();
        } else {
          connectionStatus.textContent = '服务器未返回有效的模型列表';
          connectionStatus.style.color = 'var(--error-color)';
        }
      } else {
        connectionStatus.textContent = `获取失败: ${response.status}`;
        connectionStatus.style.color = 'var(--error-color)';
      }
    } catch (error) {
      connectionStatus.textContent = `连接失败: ${error.message}`;
      connectionStatus.style.color = 'var(--error-color)';
    } finally {
      getModelsBtn.disabled = false;
      getModelsBtn.textContent = '获取可用模型';
    }
  });
}

// Load all i18n text
function loadI18nText() {
  // Get current UI language
  const currentLang = chrome.i18n.getUILanguage();
  
  // Show sponsor tab only for Chinese language
  const sponsorTabBtn = document.querySelector('.sponsor-tab-btn');
  if (sponsorTabBtn) {
    sponsorTabBtn.style.display = currentLang.startsWith('zh') ? 'flex' : 'none';
  }

  // Tab labels
  document.getElementById('settingsTabLabel').textContent = '设置';
  document.getElementById('sponsorTabLabel').textContent = '赞助';
  document.getElementById('sponsorTabTitle').textContent = '赞助';

  // Settings tab
  document.getElementById('settingsTitle').textContent = '设置';
  document.getElementById('settingsFeatureExplanation').textContent = '配置服务器地址和AI模型，修改后将立即应用到扩展程序中。';
  document.getElementById('serverUrlLabel').textContent = '服务器地址';
  document.getElementById('serverUrlHint').textContent = '输入您的服务器地址，支持HTTP和HTTPS协议';
  document.getElementById('modelSelectLabel').textContent = '处理模型';
  document.getElementById('modelSelectHint').textContent = '选择用于背景移除的AI模型';

  // Sponsor tab
  const sponsorTitle = document.getElementById('sponsorTitle');
  if (sponsorTitle) {
    sponsorTitle.textContent = '感谢使用！如果觉得好用，欢迎通过微信二维码赞助支持 😊';
  }
}

// Function to save settings
function saveSettings() {
  // Collect settings
  const settings = {
    serverUrl: document.getElementById('serverUrl').value,
    selectedModel: document.getElementById('modelSelect').value
  };

  // Save settings and immediately apply to background script
  chrome.storage.sync.set(settings, () => {
    console.log('Settings saved automatically');
    
    // Send message to background script to apply changes immediately
    chrome.runtime.sendMessage({
      action: 'updateServerConfig',
      serverUrl: settings.serverUrl,
      selectedModel: settings.selectedModel
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Background script not available, settings saved for next reload');
      } else {
        console.log('Server configuration applied immediately');
      }
    });
  });
}

