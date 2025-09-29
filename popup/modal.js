chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateContent") {
    const modalBody = document.getElementById("modal-body");
    const reprocessBtn = document.getElementById("banana-peel-reprocess-action");
    const downloadBtn = document.getElementById("banana-peel-download-action");

    if (modalBody) {
      modalBody.innerHTML = request.content;
    }

    if (request.showButtons) {
        reprocessBtn.style.display = "inline-flex";
        downloadBtn.style.display = "inline-flex";
    } else {
        reprocessBtn.style.display = "none";
        downloadBtn.style.display = "none";
    }
  }
});

document.getElementById("banana-peel-close-action").addEventListener("click", () => {
    window.close();
});

document.getElementById("banana-peel-reprocess-action").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "reprocessImage" });
});

document.getElementById("banana-peel-download-action").addEventListener("click", () => {
    const image = document.getElementById("banana-peel-result-image");
    if (image) {
        chrome.runtime.sendMessage({ action: "downloadImage", imageUrl: image.src });
    }
});
