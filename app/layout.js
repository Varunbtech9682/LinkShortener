import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "Minimal URL shortener take-home project"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">TinyLink</h1>
                <p className="text-xs text-slate-400">
                  Tiny URL shortener with stats &amp; health check
                </p>
              </div>
              <nav className="text-xs space-x-4 text-slate-300">
                <a href="/" className="hover:text-white transition-colors">
                  Dashboard
                </a>
                <a href="/healthz" className="hover:text-white transition-colors">
                  Health
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
          </main>
          <footer className="border-t border-slate-800 text-xs text-slate-500 py-4">
            <div className="max-w-5xl mx-auto px-4 flex justify-between">
              <span>TinyLink &middot; Take-home assignment</span>
              <span>/healthz &middot; /api/links</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
