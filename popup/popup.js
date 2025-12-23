// Constants
const DEFAULT_MODEL = 'background-remover';
const DEFAULT_SERVER_URL = 'https://api.bp.rick216.cn';

// Initialize and load settings
document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings and then fetch models if needed
  loadSettings((data) => {
    if (data.selectedModel) {
      // If a model is already saved, display it directly
      const modelSelect = document.getElementById('modelSelect');
      const option = document.createElement('option');
      option.value = data.selectedModel;
      option.textContent = data.selectedModel;
      modelSelect.appendChild(option);
      modelSelect.value = data.selectedModel;
    }
    fetchModelsFromServer();
  });

  // Set up tab switching
  setupTabs();

  // Restore the last active tab
  restoreLastActiveTab();

  // Set up auto-save functionality
  setupAutoSave();

  // Set up watermark tab
  setupWatermarkTab();

  // Set up other UI elements
  setupUIElements();

  // Set all i18n text
  loadI18nText();
});

// Function to load saved settings
function loadSettings(callback) {
  chrome.storage.sync.get([
    'serverUrl',
    'selectedModel',
    'workflowRemoveWatermark',
    'workflowRemoveBackground'
  ], (data) => {
    // Server URL setting
    document.getElementById('serverUrl').value = data.serverUrl || DEFAULT_SERVER_URL;

    // Workflow settings
    document.getElementById('workflowRemoveWatermark').checked = data.workflowRemoveWatermark !== false; // Default true
    document.getElementById('workflowRemoveBackground').checked = data.workflowRemoveBackground === true; // Default false

    // Store the selected model for later use in fetchModelsFromServer
    window.savedSelectedModel = data.selectedModel;

    // Call the callback function if provided
    if (callback && typeof callback === 'function') {
      callback(data);
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

  // Workflow checkboxes
  document.getElementById('workflowRemoveWatermark').addEventListener('change', saveSettings);
  document.getElementById('workflowRemoveBackground').addEventListener('change', saveSettings);
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
            option.textContent = model + (model === DEFAULT_MODEL ? chrome.i18n.getMessage('defaultModel') : '');
          } else if (model && model.name) {
            // New format: model is an object with name and description
            option.value = model.name;
            const description = model.desc;
            option.textContent = model.name + (description ? ` (${description})` : '') + (model.name === DEFAULT_MODEL ? chrome.i18n.getMessage('defaultModel') : '');
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
          if (modelNames.includes(DEFAULT_MODEL)) {
            modelSelect.value = DEFAULT_MODEL;
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
  document.getElementById('workflowsTabLabel').textContent = chrome.i18n.getMessage('workflowsTab');
  document.getElementById('backgroundTabLabel').textContent = chrome.i18n.getMessage('backgroundTab');
  document.getElementById('removeWatermarkTabLabel').textContent = chrome.i18n.getMessage('removeWatermarkTab');
  document.getElementById('sponsorTabLabel').textContent = chrome.i18n.getMessage('sponsorTab');
  document.getElementById('sponsorTabTitle').textContent = chrome.i18n.getMessage('sponsorTab');

  // Workflows tab
  document.getElementById('workflowsTitle').textContent = chrome.i18n.getMessage('workflowsTitle');
  document.getElementById('workflowsFeatureExplanation').textContent = chrome.i18n.getMessage('workflowsExplanation');
  document.getElementById('workflowRemoveWatermarkLabel').textContent = chrome.i18n.getMessage('workflowRemoveWatermark');
  document.getElementById('workflowRemoveBackgroundLabel').textContent = chrome.i18n.getMessage('workflowRemoveBackground');

  // Background tab
  document.getElementById('backgroundTitle').textContent = chrome.i18n.getMessage('backgroundTab');
  document.getElementById('backgroundFeatureExplanation').textContent = chrome.i18n.getMessage('backgroundExplanation');
  document.getElementById('serverUrlLabel').textContent = chrome.i18n.getMessage('serverUrlLabel');
  document.getElementById('serverUrlHint').textContent = chrome.i18n.getMessage('serverUrlHint');
  document.getElementById('modelSelectLabel').textContent = chrome.i18n.getMessage('modelSelectLabel');
  document.getElementById('modelSelectHint').textContent = chrome.i18n.getMessage('modelSelectHint');

  // Watermark tab
  document.getElementById('removeWatermarkTitle').textContent = chrome.i18n.getMessage('removeWatermarkTab');
  document.getElementById('watermarkFeatureExplanation').textContent = chrome.i18n.getMessage('watermarkExplanation');
  document.getElementById('uploadImageLabel').textContent = chrome.i18n.getMessage('uploadImage');
  document.getElementById('downloadProcessedLabel').textContent = chrome.i18n.getMessage('downloadProcessed');
  document.getElementById('reuploadLabel').textContent = chrome.i18n.getMessage('reupload');

  // Sponsor tab
  const sponsorTitle = document.getElementById('sponsorTitle');
  if (sponsorTitle) {
    sponsorTitle.textContent = chrome.i18n.getMessage('sponsorTitle');
  }
}

// Set up watermark tab logic
function setupWatermarkTab() {
  const uploadBox = document.getElementById('uploadBox');
  const imageInput = document.getElementById('imageInput');
  const uploadContainer = document.getElementById('uploadContainer');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const downloadBtn = document.getElementById('downloadBtn');
  const reuploadBtn = document.getElementById('reuploadBtn');
  const processLoader = document.getElementById('processLoader');

  uploadBox.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview and loading
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      imagePreview.src = dataUrl;
      uploadContainer.style.display = 'none';
      previewContainer.style.display = 'flex';
      processLoader.style.display = 'block';
      downloadBtn.disabled = true;

      try {
        await processWatermark(dataUrl, file.name);
      } catch (err) {
        console.error('Processing failed:', err);
        processLoader.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  });

  reuploadBtn.addEventListener('click', () => {
    imageInput.value = '';
    uploadContainer.style.display = 'block';
    previewContainer.style.display = 'none';
    imagePreview.src = '';
  });

  async function processWatermark(dataUrl, originalFilename) {
    const bg48 = window.BG_48_DATA;
    const bg96 = window.BG_96_DATA;

    if (!bg48 || !bg96) {
      alert('Watermark assets missing');
      return;
    }

    if (typeof WatermarkEngine === 'undefined') {
      alert('WatermarkEngine not found');
      return;
    }

    const engine = await WatermarkEngine.create(bg48, bg96);
    const img = new Image();
    img.onload = async () => {
      const processedCanvas = await engine.removeWatermarkFromImage(img);
      const resultUrl = processedCanvas.toDataURL('image/png');
      imagePreview.src = resultUrl;
      processLoader.style.display = 'none';
      downloadBtn.disabled = false;

      // Update download behavior
      downloadBtn.onclick = () => {
        let finalFilename = 'watermark-removed.png';
        if (originalFilename) {
          const dotIndex = originalFilename.lastIndexOf('.');
          if (dotIndex !== -1) {
            const name = originalFilename.substring(0, dotIndex);
            finalFilename = `${name}_watermark_removed.png`;
          } else {
            finalFilename = `${originalFilename}_watermark_removed.png`;
          }
        }

        chrome.runtime.sendMessage({
          action: 'downloadImage',
          imageUrl: resultUrl,
          filename: finalFilename
        });
      };
    };
    img.src = dataUrl;
  }
}

function saveSettings() {
  // Collect settings
  const settings = {
    serverUrl: document.getElementById('serverUrl').value,
    selectedModel: document.getElementById('modelSelect').value,
    workflowRemoveWatermark: document.getElementById('workflowRemoveWatermark').checked,
    workflowRemoveBackground: document.getElementById('workflowRemoveBackground').checked
  };

  // Save settings and immediately apply to background script
  chrome.storage.sync.set(settings, () => {
    console.log('Settings saved automatically');

    // Notify background script that settings changed
    chrome.runtime.sendMessage({ action: 'settingsChanged' });
  });
}

