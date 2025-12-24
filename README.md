# BananaPeel 🍌

**BananaPeel** is a powerful browser extension that helps you effortlessly process images. From watermark cleanup to background removal, it streamlines your AI image workflow!

[简体中文](README.zh-CN.md)

## ✨ Features

- **🖼️ Background Removal:** Right-click any image to remove its background instantly using AI.
- **💧 Watermark Removal:** Specialized tool to remove Gemini watermarks (Offline, runs entirely in your browser).
- **🚀 Automated Workflows:** Pre-configure steps in the popup. Right-click any image and select "Apply Workflow" to execute a sequence like "Watermark Removal + Background Removal" in one go.
- **⚡ One-Click Operation:** Process images directly from the context menu without downloading and re-uploading.
- **🎨 Instant Preview:** Results are displayed in a clean, draggable pop-up window for immediate download.
- **🤖 Multiple Models:** Supports various open-source models via [rembg](https://github.com/danielgatis/rembg).
- **🛡️ Private & Secure:** Use our official server or [deploy your own](https://github.com/Yorick-Ryu/rembg-server) for total privacy.

## 🎯 Why BananaPeel?

As developers and creators, we often use AI tools like Nano Banana, Midjourney, or Gemini to generate assets. However, these images often come with unwanted backgrounds or watermarks. BananaPeel eliminates the tedious process of downloading, visiting third-party sites, and re-uploading, saving you time and money.

## How to Use

### 1. Installation

1.  **From App Store:**
    - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/fdheafpfkojjbdgkjeidbnjbpljpejoo)
    - [Chrome Web Store](http://chromewebstore.google.com/detail/banana-peel/djldpeokcpbkjkpmmichpkcdgpdemadj)
2.  **From Source:**
    - Download and unzip the [source code](https://github.com/Yorick-Ryu/BananaPeel/archive/refs/heads/master.zip).
    - Go to `chrome://extensions` or `edge://extensions`.
    - Enable "Developer mode" and click "Load unpacked".

> **Note:** Refresh your open tabs after installation to enable the extension.

### 2. Processing Images

- **Right-Click Menu:**
  - **Remove Background:** Directly removes the background of the selected image.
  - **Remove Gemini Watermark:** Cleans up the Gemini watermark from the image.
  - **Apply Workflow:** Executes your configured processing steps (e.g., Watermark + Background) in one go.
- **Extension Popup:**
  - Open the popup to configure your **Workflows**.
  - Use the **Remove Watermark** tab to manually upload and process local images.
  - Configure your **Background Removal** server settings.

### 3. Backend Configuration (Optional)

By default, the extension uses our official server `https://api.bp.rick216.cn`. For better performance or privacy, you can [host your own server](https://github.com/Yorick-Ryu/rembg-server).

## 🙏 Acknowledgements

This project was inspired by or uses logic from these amazing open-source projects:

- [gemini-watermark-remover](https://github.com/journey-ad/gemini-watermark-remover)
- [GeminiWatermarkTool](https://github.com/allenk/GeminiWatermarkTool)