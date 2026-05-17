import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "YourBlog",
  description: "Blog platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <header className="site-header">
          <div className="site-container site-header-inner">
            <Link href="/" className="site-logo">
              YourBlog
            </Link>
            <nav className="site-nav">
              <Link href="/">Головна</Link>
              <Link href="/about">Про нас</Link>
              <Link href="/search">Пошук</Link>
              <Link href="/admin">Адмінка</Link>
            </nav>
          </div>
        </header>
        <main className="site-container site-main">{children}</main>
      </body>
    </html>
  );
}
