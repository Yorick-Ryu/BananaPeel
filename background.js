// Constants
const DEFAULT_MODEL = 'background-remover';
const DEFAULT_SERVER_URL = 'https://api.bp.rick216.cn';

let modalWindowId = null;
let lastImageUrl = null;

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
    } else if (request.action === 'reprocessImage') {
        if (lastImageUrl) {
            processImage(lastImageUrl, sender.tab.id, true);
        }
        sendResponse({ success: true });
    } else if (request.action === 'downloadImage') {
        chrome.downloads.download({
            url: request.imageUrl,
            filename: 'background-removed-image.png',
            saveAs: true
        });
        sendResponse({ success: true });
    } else if (request.action === "showModal") {
        showOrUpdateModal(request.content, request.showButtons);
        sendResponse({ success: true });
    }
    return true; // Keep message channel open for async response
});

function showOrUpdateModal(content, showButtons = false) {
    const width = 400;
    const height = 460;
    if (modalWindowId) {
        chrome.windows.update(modalWindowId, { focused: true });
        // Use a timeout to ensure the window is focused before sending the message
        setTimeout(() => {
            chrome.runtime.sendMessage({ action: "updateContent", content: content, showButtons: showButtons });
        }, 100);
    } else {
        chrome.windows.getLastFocused({ populate: true }, (lastWindow) => {
            const top = Math.round(lastWindow.top + (lastWindow.height - height) / 2);
            const left = Math.round(lastWindow.left + (lastWindow.width - width) / 2);

            chrome.windows.create({
                url: chrome.runtime.getURL("popup/modal.html"),
                type: "popup",
                width: width,
                height: height,
                left: left,
                top: top,
                focused: true
            }, (win) => {
                modalWindowId = win.id;
                
                chrome.windows.onRemoved.addListener(function listener(windowId) {
                    if (windowId === modalWindowId) {
                        modalWindowId = null;
                        chrome.windows.onRemoved.removeListener(listener);
                    }
                });

                // Wait for the window to load before sending the content
                setTimeout(() => {
                    chrome.runtime.sendMessage({ action: "updateContent", content: content, showButtons: showButtons });
                }, 300);
            });
        });
    }
}

// Function to process image
async function processImage(imageUrl, tabId, isReprocess = false) {
  lastImageUrl = imageUrl;
  // Show modal with loading indicator first for better UX
  const loadingContent = `
    <div class="banana-peel-loading">
        <p>${chrome.i18n.getMessage('processingImage', 'Processing image...')}</p>
        <div class="banana-peel-loader"></div>
    </div>
  `;
  showOrUpdateModal(loadingContent, false);


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
      const imageContent = `
        <div class="banana-peel-success">
            <img id="banana-peel-result-image" src="${base64data}" alt="${chrome.i18n.getMessage('processedImage', 'Processed Image')}">
        </div>
      `;
      showOrUpdateModal(imageContent, true);
    };
    reader.readAsDataURL(processedBlob);

  } catch (error) {
    console.error("Error:", error);
    const errorContent = `
        <div class="banana-peel-error">
            <p>${chrome.i18n.getMessage('errorOccurred', 'An error occurred')}: ${error.toString()}</p>
        </div>
    `;
    showOrUpdateModal(errorContent, false);
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "removeBackground") {
    const imageUrl = info.srcUrl;

    // Inject content script first
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: false },
      files: ["scripts/content.js"]
    }, () => {
      processImage(imageUrl, tab.id);
    });
  }
});
