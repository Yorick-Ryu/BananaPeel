// Constants
const DEFAULT_MODEL = 'background-remover';
const DEFAULT_SERVER_URL = 'https://api.bp.rick216.cn';

function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "applyWorkflow",
      title: chrome.i18n.getMessage("applyWorkflow"),
      contexts: ["image"]
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
});

// Helper function to get local time zone timestamp
function getLocalTimestamp() {
  const now = new Date();
  // Format date in local timezone
  const options = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  };
  const localTime = now.toLocaleString('zh-CN', options)
    .replace(/[\/\s:]/g, '-')
    .replace(',', '');
  return localTime;
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processImage') {
    // Handle reprocess request
    runWorkflow(request.imageUrl, sender.tab.id, true);
    sendResponse({ success: true });
  } else if (request.action === 'removeWatermark') {
    // Legacy mapping or specific trigger
    runWorkflow(request.imageUrl, sender.tab.id, true);
    sendResponse({ success: true });
  } else if (request.action === 'downloadImage') {
    const timestamp = getLocalTimestamp();
    const filename = `Banana-${timestamp}.png`;
    chrome.downloads.download({
      url: request.imageUrl,
      filename: filename,
      saveAs: true
    });
    sendResponse({ success: true });
  } else if (request.action === 'settingsChanged') {
    createContextMenu();
    sendResponse({ success: true });
  }
  return true;
});

/**
 * Main Workflow Engine
 */
async function runWorkflow(imageUrl, tabId, isReprocess = false) {
  const data = await chrome.storage.sync.get(['workflowRemoveWatermark', 'workflowRemoveBackground']);
  const doWatermark = data.workflowRemoveWatermark !== false;
  const doBackground = data.workflowRemoveBackground === true;

  // Show loading modal
  chrome.tabs.sendMessage(tabId, {
    action: "showLoadingModal",
    imageUrl: imageUrl,
    isReprocess: isReprocess,
    type: 'workflow'
  });

  let currentUrl = imageUrl;

  try {
    // Step 1: Remove Watermark
    if (doWatermark) {
      chrome.tabs.sendMessage(tabId, { action: "updateProgress", message: chrome.i18n.getMessage("stepWatermark") });
      const result = await removeWatermarkInternal(currentUrl, tabId);
      if (result.success) {
        currentUrl = result.imageUrl;
      } else {
        throw new Error(result.error || "Watermark removal failed");
      }
    }

    // Step 2: Remove Background
    if (doBackground) {
      chrome.tabs.sendMessage(tabId, { action: "updateProgress", message: chrome.i18n.getMessage("stepBackground") });
      const result = await processImageInternal(currentUrl);
      if (result.success) {
        currentUrl = result.imageUrl;
      } else {
        throw new Error(result.error || "Background removal failed");
      }
    }

    // Final Success update
    chrome.tabs.sendMessage(tabId, {
      action: "updateModalWithImage",
      imageUrl: currentUrl,
      type: 'workflow'
    });

  } catch (error) {
    console.error("Workflow Error:", error);
    chrome.tabs.sendMessage(tabId, {
      action: "showErrorInModal",
      error: error.toString()
    });
  }
}

/**
 * Background removal logic (Internal)
 */
async function processImageInternal(imageUrl) {
  try {
    const data = await chrome.storage.sync.get(['serverUrl', 'selectedModel']);
    const serverUrl = data.serverUrl || DEFAULT_SERVER_URL;
    const selectedModel = data.selectedModel || DEFAULT_MODEL;

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, "image.png");
    formData.append("model", selectedModel);

    const removeResponse = await fetch(`${serverUrl}/remove`, {
      method: "POST",
      body: formData
    });

    if (!removeResponse.ok) throw new Error(`Server error: ${removeResponse.status}`);
    const processedBlob = await removeResponse.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ success: true, imageUrl: reader.result });
      reader.readAsDataURL(processedBlob);
    });
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Watermark removal logic (Internal)
 */
async function removeWatermarkInternal(imageUrl, tabId) {
  try {
    // 1. Fetch image in background (CORS bypass)
    // Only resolve highres if it looks like a google user content URL
    const originalUrl = imageUrl.startsWith('data:') ? imageUrl : imageUrl.replace(/=s\d+(?=[-?#]|$)/, '=s0');
    const response = await fetch(originalUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const blob = await response.blob();

    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 2. Inject and process
    return new Promise((resolve) => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: async (dataUrl) => {
          try {
            const bg48 = window.BG_48_DATA;
            const bg96 = window.BG_96_DATA;
            if (!bg48 || !bg96) throw new Error("Watermark assets not found.");

            if (typeof WatermarkEngine === 'undefined') throw new Error("WatermarkEngine not initialized.");

            const engine = await WatermarkEngine.create(bg48, bg96);
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = dataUrl;
            });

            const processedCanvas = await engine.removeWatermarkFromImage(img);
            return { success: true, imageUrl: processedCanvas.toDataURL('image/png') };
          } catch (err) {
            return { success: false, error: err.toString() };
          }
        },
        args: [base64Image]
      }, (results) => {
        if (results && results[0] && results[0].result) {
          resolve(results[0].result);
        } else {
          resolve({ success: false, error: "Execution failed" });
        }
      });
    });
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "applyWorkflow") {
    const imageUrl = info.srcUrl;
    // Inject all necessary scripts first
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: false },
      files: ["scripts/content.js", "scripts/watermark_assets.js", "scripts/watermark.js"]
    }, () => {
      runWorkflow(imageUrl, tab.id);
    });
  }
});

