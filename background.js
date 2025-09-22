// Constants
const DEFAULT_MODEL = 'background-remover';
const DEFAULT_SERVER_URL = 'https://api.bp.rick216.cn';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "removeBackground",
        title: chrome.i18n.getMessage("removeBackground"),
        contexts: ["image"]
    });
});

// Listen for messages from popup to update server configuration
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'processImage') {
        // Handle reprocess request from content script
        processImage(request.imageUrl, sender.tab.id, true); // Mark as reprocess
        sendResponse({ success: true });
    } else if (request.action === 'downloadImage') {
        chrome.downloads.download({
            url: request.imageUrl,
            filename: 'background-removed-image.png',
            saveAs: true
        });
        sendResponse({ success: true });
    }
    return true; // Keep message channel open for async response
});

// Function to process image
async function processImage(imageUrl, tabId, isReprocess = false) {
  // Show modal with loading indicator first for better UX
  chrome.tabs.sendMessage(tabId, { 
    action: "showLoadingModal",
    imageUrl: imageUrl,
    isReprocess: isReprocess
  });

  try {
    const data = await chrome.storage.sync.get(['serverUrl', 'selectedModel']);
    const serverUrl = data.serverUrl || DEFAULT_SERVER_URL;
    const selectedModel = data.selectedModel || DEFAULT_MODEL;

    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, "image.png");
    formData.append("model", selectedModel);

    const removeResponse = await fetch(`${serverUrl}/remove`, {
      method: "POST",
      body: formData
    });

    if (!removeResponse.ok) {
      throw new Error(`Server error: ${removeResponse.status}`);
    }

    const processedBlob = await removeResponse.blob();
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      chrome.tabs.sendMessage(tabId, {
        action: "updateModalWithImage",
        imageUrl: base64data
      });
    };
    reader.readAsDataURL(processedBlob);

  } catch (error) {
    console.error("Error:", error);
    chrome.tabs.sendMessage(tabId, {
        action: "showErrorInModal",
        error: error.toString()
    });
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "removeBackground") {
    const imageUrl = info.srcUrl;

    // Inject content script first
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: false },
      files: ["content.js"]
    }, () => {
      processImage(imageUrl, tab.id);
    });
  }
});
