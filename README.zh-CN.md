# BananaPeel | 香蕉皮 🍌

**BananaPeel（香蕉皮）** 是一款强大的浏览器扩展，旨在帮助您轻松处理图片。从移除水印到移除背景，它能极大地简化您的 AI 图片处理工作流！

[English README](README.md)

## ✨ 功能特点

- **🖼️ 移除背景：** 右键点击任何图片，即可利用 AI 瞬间移除背景。
- **💧 去除水印：** 专门针对 Gemini 生成图片的去水印工具（离线算法，完全在浏览器本地运行）。
- **🚀 自动化工作流：** 在弹窗中预先配置处理步骤。右键点击图片选择“应用工作流”，即可一键执行如“先去水印，再移背景”的完整流水线。
- **⚡ 一键操作：** 直接通过右键菜单处理图片，无需下载后再上传到第三方网站。
- **🎨 即时预览：** 处理结果显示在整洁的可拖拽弹窗中，支持直接下载。
- **🤖 多模型支持：** 支持多种基于 [rembg](https://github.com/danielgatis/rembg) 的开源处理模型。
- **🛡️ 私密且安全：** 支持使用官方服务器或[自行部署私有服务器](https://github.com/Yorick-Ryu/rembg-server)。

## 🎯 为什么选择香蕉皮？

作为开发者和创作者，我们经常使用 Nano Banana、豆包或 Gemini 等 AI 工具生成素材。然而，这些图片往往带有背景或水印。香蕉皮消除了下载、访问第三方网站、再上传的繁琐过程，为您节省大量时间和精力。

## 如何使用？

### 1. 安装扩展

1.  **从应用商店安装：**
    - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/fdheafpfkojjbdgkjeidbnjbpljpejoo)
    - [Chrome Web Store](http://chromewebstore.google.com/detail/banana-peel/djldpeokcpbkjkpmmichpkcdgpdemadj)
2.  **从源码安装：**
    - 下载并解压[源码](https://github.com/Yorick-Ryu/BananaPeel/archive/refs/heads/master.zip)。
    - 打开浏览器扩展管理页面 (`chrome://extensions` 或 `edge://extensions`)。
    - 开启“开发者模式”，点击“加载已解压的扩展程序”。

> **提示：** 安装后，请刷新已打开的标签页以激活扩展。

### 2. 处理图片

- **右键菜单：**
  - **移除背景：** 直接移除所选图片的背景。
  - **移除 Gemini 水印：** 清理图片中的 Gemini 水印。
  - **应用工作流：** 一键执行您配置好的处理步骤（例如：先去水印再移背景）。
- **扩展弹窗 (Popup)：**
  - 打开弹窗以配置您的**工作流**步骤。
  - 使用**去水印**标签页手动上传并处理本地图片。
  - 配置您的**背景移除**服务器设置。

### 3. 后端配置（可选）

扩展默认使用官方服务器 `https://api.bp.rick216.cn`。为了获得更佳的性能或更好的隐私保护，您可以选择[自行部署服务器](https://github.com/Yorick-Ryu/rembg-server)。
