import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BananaPeel | 香蕉皮 - 一键移除图片背景",
  description: "BananaPeel 是一款浏览器扩展，可以帮助你快速移除图片的背景，告别第三方抠图网站的烦恼！",
  openGraph: {
    title: "BananaPeel | 香蕉皮 - 一键移除图片背景",
    description: "BananaPeel 是一款浏览器扩展，可以帮助你快速移除图片的背景，告别第三方抠图网站的烦恼！",
    url: "https://bp.rick216.cn",
    siteName: "BananaPeel",
    images: [
      {
        url: "https://bp.rick216.cn/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BananaPeel | 香蕉皮 - 一键移除图片背景",
    description: "BananaPeel 是一款浏览器扩展，可以帮助你快速移除图片的背景，告别第三方抠图网站的烦恼！",
    images: ["https://bp.rick216.cn/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
