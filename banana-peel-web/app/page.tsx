import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-color)] min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-[var(--bg-color)]/80 backdrop-blur-sm border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="BananaPeel Logo"
              width={32}
              height={32}
            />
            <h1 className="text-xl font-bold">BananaPeel | 香蕉皮</h1>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="#features"
              className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors"
            >
              功能
            </a>
            <a
              href="#how-to-use"
              className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors"
            >
              如何使用
            </a>
            <a
              href="https://github.com/Yorick-Ryu/BananaPeel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            一键移除图片背景
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--text-secondary)]">
            告别繁琐的抠图网站，在浏览器中即时移除任何图片的背景。
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="http://chromewebstore.google.com/detail/banana-peel/djldpeokcpbkjkpmmichpkcdgpdemadj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]"
            >
              Chrome 应用商店
            </a>
            <a
              href="https://microsoftedge.microsoft.com/addons/detail/fdheafpfkojjbdgkjeidbnjbpljpejoo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-[var(--border-color)] text-base font-medium rounded-md hover:bg-[var(--border-color)]"
            >
              Edge 应用商店
            </a>
          </div>
        </section>

        <section id="features" className="py-20 bg-[var(--sidebar-bg)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold">核心功能</h3>
              <p className="text-[var(--text-secondary)] mt-2">简单、强大、高效</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-[var(--card-bg)] rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">🚀 一键操作</h4>
                <p className="text-[var(--text-secondary)]">
                  右键点击图片即可直接处理，无需下载和重新上传。
                </p>
              </div>
              <div className="p-6 bg-[var(--card-bg)] rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">🖼️ 即时预览</h4>
                <p className="text-[var(--text-secondary)]">
                  处理结果会显示在一个可拖拽的弹窗中，方便预览和下载。
                </p>
              </div>
              <div className="p-6 bg-[var(--card-bg)] rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">🛡️ 两种模式</h4>
                <p className="text-[var(--text-secondary)]">
                  可使用我们的免费服务器，或部署私有服务器。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-to-use" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold">三步轻松上手</h3>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-5xl mb-2">1.</div>
                <h4 className="text-xl font-semibold">安装扩展</h4>
                <p className="text-[var(--text-secondary)]">
                  从 Chrome 或 Edge 应用商店安装。
                </p>
              </div>
              <div className="text-2xl text-[var(--text-secondary)] hidden md:block">
                →
              </div>
              <div className="text-center">
                <div className="text-5xl mb-2">2.</div>
                <h4 className="text-xl font-semibold">右键点击图片</h4>
                <p className="text-[var(--text-secondary)]">
                  在任意网页上找到你想要处理的图片。
                </p>
              </div>
              <div className="text-2xl text-[var(--text-secondary)] hidden md:block">
                →
              </div>
              <div className="text-center">
                <div className="text-5xl mb-2">3.</div>
                <h4 className="text-xl font-semibold">选择 "移除背景"</h4>
                <p className="text-[var(--text-secondary)]">
                  处理后的图片将立即呈现。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--sidebar-bg)] border-t border-[var(--border-color)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-[var(--text-secondary)]">
          <p>
            &copy; {new Date().getFullYear()} BananaPeel. 由{" "}
            <a
              href="https://github.com/Yorick-Ryu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary-color)] hover:underline"
            >
              Yorick-Ryu
            </a>
            创建.
          </p>
        </div>
      </footer>
    </div>
  );
}
