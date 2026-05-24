// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { WebSiteSchema } from "@/components/seo/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourblog.com";

export const metadata: Metadata = {
  title: {
    default: "IT Blog — Статті про веб-розробку українською",
    template: "%s | IT Blog",
  },
  description:
    "Практичні статті про JavaScript, React, TypeScript, Node.js, DevOps та AI для українських розробників.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "IT Blog",
  },
  verification: {
    google: "google-site-verification=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <head>
        <WebSiteSchema
          siteUrl={SITE_URL}
          siteName="IT Blog"
          description="Практичні статті про веб-розробку для українських розробників."
        />
      </head>
      <body>
        <header className="site-header">
          <div className="site-container site-header-inner">
            <Link href="/" className="site-logo">
              IT Blog
            </Link>
            {/* Nav mirrors the silo structure: one link per top-level category */}
            <nav className="site-nav" aria-label="Основна навігація">
              <Link href="/categories/frontend">Frontend</Link>
              <Link href="/categories/backend">Backend</Link>
              <Link href="/categories/devops">DevOps</Link>
              <Link href="/categories/ai">AI & ML</Link>
              <Link href="/categories/productivity">Productivity</Link>
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
            <nav className="footer-nav" aria-label="Навігація футера">
              <Link href="/categories">Категорії</Link>
              <Link href="/authors">Автори</Link>
              <Link href="/about">Про нас</Link>
              <Link href="/admin">Адмінка</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
