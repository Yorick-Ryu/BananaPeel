// Store server configuration globally
let serverUrl = 'http://127.0.0.1:7001'; // Default value
let selectedModel = 'isnet-general-use'; // Default model

// Load server configuration from storage on startup
chrome.runtime.onStartup.addListener(() => {
    loadServerConfig();
});

chrome.runtime.onInstalled.addListener(() => {
    // Load server configuration on installation
    loadServerConfig();
    
    chrome.contextMenus.create({
        id: "removeBackground",
        title: chrome.i18n.getMessage("removeBackground"),
        contexts: ["image"]
    });
});

// Function to load server configuration from storage
function loadServerConfig() {
    chrome.storage.sync.get(['serverUrl', 'selectedModel'], (data) => {
        if (data.serverUrl) {
            serverUrl = data.serverUrl;
            console.log('Server URL loaded:', serverUrl);
        }
        if (data.selectedModel) {
            selectedModel = data.selectedModel;
            console.log('Selected model loaded:', selectedModel);
        }
    });
}

// Listen for messages from popup to update server configuration
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateServerConfig') {
        serverUrl = request.serverUrl || 'http://127.0.0.1:7001'; // Fallback to default
        selectedModel = request.selectedModel || 'isnet-general-use'; // Fallback to default
        console.log('Server URL updated:', serverUrl);
        console.log('Selected model updated:', selectedModel);
        sendResponse({ success: true });
    }
    return true; // Keep message channel open for async response
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "removeBackground") {
    const imageUrl = info.srcUrl;

    // Immediately show modal with loading indicator
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(tab.id, { action: "showLoadingModal" });
    });

    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append("file", blob, "image.png");
        formData.append("model", selectedModel);

        return fetch(`${serverUrl}/remove`, {
          method: "POST",
          body: formData
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.blob();
      })
      .then(processedBlob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          chrome.tabs.sendMessage(tab.id, {
            action: "updateModalWithImage",
            imageUrl: base64data
          });
        };
        reader.readAsDataURL(processedBlob);
      })
      .catch(error => {
        console.error("Error:", error);
        chrome.tabs.sendMessage(tab.id, {
            action: "showErrorInModal",
            error: error.toString()
        });
      });
  }
});
