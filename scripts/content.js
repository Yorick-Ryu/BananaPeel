if (typeof window.bananaPeelContentScriptLoaded === 'undefined') {
  window.bananaPeelContentScriptLoaded = true;

  function showOrUpdateModal(content, isUpdate = false) {
    let modal = document.getElementById("banana-peel-modal");
    const modalBody = modal ? modal.querySelector(".banana-peel-modal-body") : null;

    if (modal && modalBody && isUpdate) {
      // If modal exists and this is an update, just change the body content
      modalBody.innerHTML = content;

      // Reset action buttons to their default state
      const reprocessAction = document.getElementById("banana-peel-reprocess-action");
      const downloadAction = document.getElementById("banana-peel-download-action");
      if (reprocessAction) reprocessAction.style.display = "none";
      if (downloadAction) downloadAction.style.display = "none";
    } else {
      // If modal doesn't exist, create it from scratch
      if (modal) {
        modal.remove();
      }

      modal = document.createElement("div");
      modal.id = "banana-peel-modal";
      modal.className = "banana-peel-modal";
      modal.innerHTML = `
        <div class="banana-peel-modal-content">
          <div class="banana-peel-modal-header">
            <div class="banana-peel-title">
              <img src="${chrome.runtime.getURL("icons/icon128.png")}" class="banana-peel-icon">
              <span>${getLocalizedMessage('extName', 'Banana Peel')}</span>
            </div>
            <div class="banana-peel-actions">
              <span id="banana-peel-reprocess-action" style="display: none;" title="${getLocalizedMessage('reprocess', 'Reprocess')}">&#x21bb;</span>
              <span id="banana-peel-download-action" style="display: none;" title="Download">&#x2913;</span>
              <span id="banana-peel-close-action" title="Close">&times;</span>
            </div>
          </div>
          <div class="banana-peel-modal-body">
            ${content}
          </div>
        </div>`;
      document.body.appendChild(modal);

      const closeModal = () => {
        const modalElement = document.getElementById("banana-peel-modal");
        if (modalElement) {
          modalElement.remove();
          // Remove keyboard event listener when modal is closed
          document.removeEventListener("keydown", handleKeyDown);
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeModal();
        }
      };

      document.getElementById("banana-peel-close-action").addEventListener("click", closeModal);

      // Add keyboard event listener for Esc key
      document.addEventListener("keydown", handleKeyDown);

      makeDraggable(modal.querySelector(".banana-peel-modal-content"), modal.querySelector(".banana-peel-modal-header"));
    }
  }

  function makeDraggable(element, dragHandle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    dragHandle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  var currentImageData = {
    url: null,
    type: 'background'
  };

  function getLocalizedMessage(key, defaultText) {
    try {
      return chrome.i18n.getMessage(key) || defaultText;
    } catch (error) {
      return defaultText;
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showLoadingModal") {
      currentImageData.url = request.imageUrl;
      currentImageData.type = request.type || 'background';

      const loadingContent = `
        <div class="banana-peel-loading">
          <p id="banana-peel-status-text">${getLocalizedMessage('processingImage', 'Processing image...')}</p>
          <div class="banana-peel-loader"></div>
        </div>
      `;

      const isUpdate = request.isReprocess || false;
      showOrUpdateModal(loadingContent, isUpdate);
    } else if (request.action === "updateProgress") {
      const statusText = document.getElementById("banana-peel-status-text");
      if (statusText) {
        statusText.textContent = request.message;
      }
    } else if (request.action === "updateModalWithImage") {
      const imageContent = `
        <div class="banana-peel-success">
          <img id="banana-peel-result-image" src="${request.imageUrl}" alt="${getLocalizedMessage('processedImage', 'Processed Image')}">
        </div>
      `;
      showOrUpdateModal(imageContent, true);

      const downloadAction = document.getElementById("banana-peel-download-action");
      downloadAction.style.display = "inline";
      downloadAction.onclick = () => {
        chrome.runtime.sendMessage({
          action: "downloadImage",
          imageUrl: request.imageUrl,
          filename: currentImageData.type === 'watermark' ? 'gemini-watermark-removed.png' : 'background-removed.png'
        });
      };

      const reprocessAction = document.getElementById("banana-peel-reprocess-action");
      if (currentImageData.url) {
        reprocessAction.style.display = "inline";
        reprocessAction.onclick = () => {
          chrome.runtime.sendMessage({
            action: currentImageData.type === 'watermark' ? 'removeWatermark' : 'processImage',
            imageUrl: currentImageData.url
          });
        };
      }
    } else if (request.action === "showErrorInModal") {
      const errorContent = `
        <div class="banana-peel-error">
          <p>${getLocalizedMessage('errorOccurred', 'An error occurred')}: ${request.error}</p>
        </div>
      `;
      showOrUpdateModal(errorContent, true);
    }
  });
}