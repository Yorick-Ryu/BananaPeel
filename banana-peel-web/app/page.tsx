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
          <nav className="flex items-center gap-6">
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
              className="flex items-center gap-1 text-sm font-medium hover:text-[var(--primary-color)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-balance">
            全能图片处理，一键即达
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--text-secondary)]">
            不再需要繁琐的下载与上传。从<strong>清洗水印</strong>到<strong>移除背景</strong>，香蕉皮让您的 AI 图片处理工作流从未如此顺畅。
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="http://chromewebstore.google.com/detail/banana-peel/djldpeokcpbkjkpmmichpkcdgpdemadj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] transition-all transform hover:scale-105 shadow-lg"
            >
              Chrome 应用商店
            </a>
            <a
              href="https://microsoftedge.microsoft.com/addons/detail/fdheafpfkojjbdgkjeidbnjbpljpejoo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[var(--border-color)] text-base font-bold rounded-full hover:bg-[var(--border-color)] transition-all transform hover:scale-105"
            >
              Edge Add-ons
            </a>
          </div>
        </section>

        <section id="features" className="py-24 bg-[var(--sidebar-bg)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold sm:text-4xl">核心功能</h3>
              <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
                我们专注于解决 AI 创作过程中的每一个繁琐环节
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-[var(--card-bg)] rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-transparent hover:border-[var(--primary-color)]/30">
                <div className="text-4xl mb-6">🖼️</div>
                <h4 className="text-xl font-bold mb-3">移除背景</h4>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  右键点击即可利用 AI 瞬间移除背景。支持云端与本地自部署两种模式。
                </p>
              </div>
              <div className="p-8 bg-[var(--card-bg)] rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-transparent hover:border-[var(--primary-color)]/30">
                <div className="text-4xl mb-6">💧</div>
                <h4 className="text-xl font-bold mb-3">一键去水印</h4>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  采用<strong>离线算法</strong>，完全在您的浏览器本地运行，极速去除 Gemini 等 AI 水印，保护隐私。
                </p>
              </div>
              <div className="p-8 bg-[var(--card-bg)] rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-transparent hover:border-[var(--primary-color)]/30">
                <div className="text-4xl mb-6">🚀</div>
                <h4 className="text-xl font-bold mb-3">自动化工作流</h4>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  在插件中<strong>预先配置</strong>处理步骤。右键一键触发“先去水印，再移背景”的完美连招。
                </p>
              </div>
              <div className="p-8 bg-[var(--card-bg)] rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-transparent hover:border-[var(--primary-color)]/30">
                <div className="text-4xl mb-6">🎨</div>
                <h4 className="text-xl font-bold mb-3">即时预览</h4>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  处理结果通过美观的悬浮窗即时呈现，支持拖拽移动与一键下载。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-to-use" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold sm:text-4xl">极简流程</h3>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20">
              <div className="text-center max-w-[200px]">
                <div className="w-16 h-16 bg-[var(--primary-color)] text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">1</div>
                <h4 className="text-xl font-bold mb-2">配置工作流</h4>
                <p className="text-[var(--text-secondary)]">
                  在插件弹窗中开启您需要的步骤（如去水印+移背景）
                </p>
              </div>
              <div className="text-4xl text-[var(--border-color)] hidden md:block">→</div>
              <div className="text-center max-w-[200px]">
                <div className="w-16 h-16 bg-[var(--primary-color)] text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">2</div>
                <h4 className="text-xl font-bold mb-2">右键点击图片</h4>
                <p className="text-[var(--text-secondary)]">
                  在任意图片上点击右键呼出菜单
                </p>
              </div>
              <div className="text-4xl text-[var(--border-color)] hidden md:block">→</div>
              <div className="text-center max-w-[200px]">
                <div className="w-16 h-16 bg-[var(--primary-color)] text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">3</div>
                <h4 className="text-xl font-bold mb-2">应用工作流</h4>
                <p className="text-[var(--text-secondary)]">
                  选择“应用工作流”，一键完成所有预设步骤
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--sidebar-bg)] border-t border-[var(--border-color)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 uppercase tracking-wider text-xs">
            <p className="text-[var(--text-secondary)]">
              &copy; {new Date().getFullYear()} BananaPeel | 香蕉皮.
            </p>
            <p className="text-[var(--text-secondary)]">
              Made with ❤️ by{" "}
              <a
                href="https://github.com/Yorick-Ryu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-color)] font-bold hover:text-[var(--primary-color)] transition-colors"
              >
                Yorick-Ryu
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
