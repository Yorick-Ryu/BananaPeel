// Initialize and load settings
document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings and then fetch models
  loadSettings(() => {
    // Automatically fetch models after settings are loaded
    fetchModelsFromServer();
  });

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
function loadSettings(callback) {
  chrome.storage.sync.get([
    'serverUrl',
    'selectedModel'
  ], (data) => {
    // Server URL setting
    document.getElementById('serverUrl').value = data.serverUrl || 'http://127.0.0.1:7001';
    
    // Store the selected model for later use in fetchModelsFromServer
    window.savedSelectedModel = data.selectedModel;
    
    // Call the callback function if provided
    if (callback && typeof callback === 'function') {
      callback();
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
  serverUrlInput.addEventListener('change', () => {
    saveSettings();
    fetchModelsFromServer(); // Re-fetch models when server URL changes
  });
  serverUrlInput.addEventListener('input', debounce(() => {
    saveSettings();
    fetchModelsFromServer(); // Re-fetch models when server URL changes
  }, 500));
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
  // No additional UI setup needed since we removed the get models button
}

// Function to automatically fetch models from server
async function fetchModelsFromServer() {
  const connectionStatus = document.getElementById('connectionStatus');
  const modelSelect = document.getElementById('modelSelect');
  const serverUrl = document.getElementById('serverUrl').value.trim();
  
  if (!serverUrl) {
    // Don't show error for empty server URL on startup
    return;
  }

  // Hide status initially
  connectionStatus.style.display = 'none';

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
          
          // Handle both old format (string) and new format (object with name and description)
          if (typeof model === 'string') {
            // Old format: model is just a string
            option.value = model;
            option.textContent = model + (model === 'isnet-general-use' ? chrome.i18n.getMessage('defaultModel') : '');
          } else if (model && model.name) {
            // New format: model is an object with name and description
            option.value = model.name;
            option.textContent = model.name + (model.description ? `(${model.description})` : '') + (model.name === 'isnet-general-use' ? chrome.i18n.getMessage('defaultModel') : '');
          }
          
          modelSelect.appendChild(option);
        });
        
        // Extract model names for comparison
        const modelNames = models.map(model => typeof model === 'string' ? model : model.name);
        
        // Restore previous selection from storage if it still exists
        if (window.savedSelectedModel && modelNames.includes(window.savedSelectedModel)) {
          modelSelect.value = window.savedSelectedModel;
        } else if (currentValue && modelNames.includes(currentValue)) {
          // Fallback to current value if saved model is not available
          modelSelect.value = currentValue;
        } else {
          // Set to default if available
          if (modelNames.includes('isnet-general-use')) {
            modelSelect.value = 'isnet-general-use';
          } else if (modelNames.length > 0) {
            modelSelect.value = modelNames[0];
          }
        }
        
        // Save the updated model selection
        saveSettings();
        
        // Hide status on success
        connectionStatus.style.display = 'none';
      } else {
        showError(chrome.i18n.getMessage('serverInvalidModels'));
      }
    } else {
      showError(`${chrome.i18n.getMessage('fetchFailed')}: ${response.status}`);
    }
  } catch (error) {
    showError(`${chrome.i18n.getMessage('connectionFailed')}: ${error.message}`);
  }
}

// Function to show error messages
function showError(message) {
  const connectionStatus = document.getElementById('connectionStatus');
  connectionStatus.textContent = message;
  connectionStatus.style.color = 'var(--error-color)';
  connectionStatus.style.display = 'block';
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

  // Extension title
  document.getElementById('extTitle').textContent = chrome.i18n.getMessage('extName');

  // Tab labels
  document.getElementById('settingsTabLabel').textContent = chrome.i18n.getMessage('settingsTab');
  document.getElementById('sponsorTabLabel').textContent = chrome.i18n.getMessage('sponsorTab');
  document.getElementById('sponsorTabTitle').textContent = chrome.i18n.getMessage('sponsorTab');

  // Settings tab
  document.getElementById('settingsTitle').textContent = chrome.i18n.getMessage('settingsTitle');
  document.getElementById('settingsFeatureExplanation').textContent = chrome.i18n.getMessage('settingsFeatureExplanation');
  document.getElementById('serverUrlLabel').textContent = chrome.i18n.getMessage('serverUrlLabel');
  document.getElementById('serverUrlHint').textContent = chrome.i18n.getMessage('serverUrlHint');
  document.getElementById('modelSelectLabel').textContent = chrome.i18n.getMessage('modelSelectLabel');
  document.getElementById('modelSelectHint').textContent = chrome.i18n.getMessage('modelSelectHint');

  // Sponsor tab
  const sponsorTitle = document.getElementById('sponsorTitle');
  if (sponsorTitle) {
    sponsorTitle.textContent = chrome.i18n.getMessage('sponsorTitle');
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

