# BananaPeel | 香蕉皮 🍌

**BananaPeel（香蕉皮）** 是一款浏览器扩展，可以帮助你快速移除图片的背景，告别第三方抠图网站的烦恼！

作为一名开发者，我经常使用 AI 工具生成图片来制作软件图标，但每次都需要为去除背景而烦恼。因此，我开发了这款扩展。

[English README](README.md)

## 🎯 痛点

- **AI 生成的图片带有背景：** 无论使用 Nano Banana、豆包 还是其他 AI 工具，生成的图片几乎总是有背景。
- **繁琐的下载和上传过程：** 你必须下载图片，打开第三方网站，上传它，然后等待处理。
- **漫长的等待时间：** 有时上传过程很慢，甚至会失败。
- **成本高昂：** 免费额度很快就会用完， 付费价格昂贵。

## ✨ 功能

- **🚀 一键操作：** 右键点击图片即可直接处理，无需下载和重新上传。
- **🖼️ 即时预览：** 处理结果会显示在一个可拖拽的弹窗中。
- **🤖 多模型可选：**
  模型来自开源项目：[rembg Models](https://github.com/danielgatis/rembg?tab=readme-ov-file#models)
- **🛡️ 两种模式：**
  - 使用我们提供的服务器，方便快速上手。
  - 部署私有服务器。我们提供基于 [rembg](https://github.com/danielgatis/rembg) 优化的[服务器](https://github.com/Yorick-Ryu/rembg-server)，可以轻松在本地电脑部署后端服务。

## 如何使用？

### 1. 准备后端服务

BananaPeel 的运行依赖于后端服务。您可以选择使用我们提供的免费服务器，或自行部署本地服务器以获得更佳的稳定性。

#### 使用官方服务器

扩展已内置官方服务器地址 `https://api.bp.rick216.cn`，开箱即用。我们承诺不会保存您的任何图片。

#### 自行部署服务器

请访问 [rembg-server 仓库](https://github.com/Yorick-Ryu/rembg-server)，按照教程进行本地部署。

### 2. 安装扩展

1.  **从应用商店安装**
    - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/fdheafpfkojjbdgkjeidbnjbpljpejoo)
    - [Chrome Web Store](http://chromewebstore.google.com/detail/banana-peel/djldpeokcpbkjkpmmichpkcdgpdemadj)
2.  **从源码安装**
    - 下载并解压[源码](https://github.com/Yorick-Ryu/Banana-Peel/archive/refs/heads/master.zip)。
    - 打开浏览器的扩展管理页面（`edge://extensions` 或 `chrome://extensions`）。
    - 启用“开发者模式”。
    - 点击“加载已解压的扩展程序”，然后选择解压后的文件夹。

> **重要提示：** 安装后，请刷新已打开的页面以激活扩展。

### 3. 开始使用

1.  在网页上右键点击任意图片。
2.  在右键菜单中选择“移除背景”。
3.  处理后的图片会出现在一个可拖拽的窗口中，您可以直接下载。
