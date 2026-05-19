// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IT Blog — Новини про технології",
    template: "%s | IT Blog",
  },
  description:
    "Актуальні статті про JavaScript, React, Node.js, DevOps та AI для розробників.",
  verification: {
    google: "google-site-verification=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>
        <header className="site-header">
          <div className="site-container site-header-inner">
            <Link href="/" className="site-logo">
              IT Blog
            </Link>
            <nav className="site-nav">
              <Link href="/">Головна</Link>
              <Link href="/categories/frontend">Frontend</Link>
              <Link href="/categories/backend">Backend</Link>
              <Link href="/categories/ai">AI & ML</Link>
              <Link href="/about">Про нас</Link>
              <Link href="/search">Пошук</Link>
            </nav>
          </div>
        </header>

        <main className="site-container site-main">{children}</main>

        <footer className="site-footer">
          <div className="site-container footer-inner">
            <p className="footer-brand">IT Blog</p>
            <p className="footer-copy">© 2026 IT Blog. Всі права захищено.</p>
            <nav className="footer-nav">
              <Link href="/about">Про нас</Link>
              <Link href="/admin">Адмінка</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
