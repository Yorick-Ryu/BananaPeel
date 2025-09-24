# BananaPeel 🍌

**BananaPeel** is a browser extension that helps you quickly remove image backgrounds, saying goodbye to the hassle of third-party cutout websites!

As a developer, I often use AI tools to generate images for software icons, but I always struggle with removing the background. That's why I created this extension.

[简体中文](README.zh-CN.md)

## 🎯 Pain Points

- **AI-generated images come with backgrounds:** Whether you use Nano Banana, Midjourney, Stable Diffusion, or other AI tools, the generated images almost always come with a background.
- **Tedious download and upload process:** You have to download the image, open a third-party website, upload it, and wait for it to be processed.
- **Long waiting times:** Sometimes the upload process is slow and may even fail.
- **High costs:** Free quotas are quickly used up, and paid plans are expensive.

## ✨ Features

- **🚀 One-Click Operation:** Right-click on an image to process it directly, no need to download and re-upload.
- **🖼️ Instant Preview:** The result is displayed in a draggable pop-up window.
- **🤖 Multiple Models Available:** Models are from the open-source project: [rembg Models](https://github.com/danielgatis/rembg?tab=readme-ov-file#models).
- **🛡️ Two Modes:**
  - Use our provided server for a quick start.
  - Deploy a private server. We provide a [server](https://github.com/Yorick-Ryu/rembg-server) optimized based on [rembg](https://github.com/danielgatis/rembg), making it easy to deploy the backend service on your local computer.

## How to Use

### 1. Prepare the Backend Service

BananaPeel relies on a backend service to work. You can choose to use our free official server or deploy a local server for better stability.

#### Use the Official Server

The extension has a built-in official server address `https://api.bp.rick216.cn`, which is ready to use out of the box. We promise not to save any of your images.

#### Deploy Your Own Server

Please visit the [rembg-server repository](https://github.com/Yorick-Ryu/rembg-server) and follow the tutorial to deploy it locally.

### 2. Install the Extension

1.  **Install from the app store**
    - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/fdheafpfkojjbdgkjeidbnjbpljpejoo)
    - [Chrome Web Store](http://chromewebstore.google.com/detail/banana-peel/djldpeokcpbkjkpmmichpkcdgpdemadj)
2.  **Install from source**
    - Download and unzip the [source code](https://github.com/Yorick-Ryu/BananaPeel/archive/refs/heads/master.zip).
    - Open your browser's extension management page (`edge://extensions` or `chrome://extensions`).
    - Enable "Developer mode".
    - Click "Load unpacked" and select the unzipped folder.

> **Important:** After installation, please refresh any open pages to activate the extension.

### 3. Start Using

1.  Right-click on any image on a webpage.
2.  Select "Remove Background" from the context menu.
3.  The processed image will appear in a draggable window, and you can download it directly.
