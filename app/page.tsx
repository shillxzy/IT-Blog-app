// ============================================================
// app/page.tsx — Public Blog Home (Silo Hub — Level 0)
// ============================================================

import Link from "next/link";
import { getArticles, getCategories } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT-Blog — блог для розробників",
  description: "Останні статті, туторіали та найкращі практики для IT-спеціалістів.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, articlesRes] = await Promise.all([
    getCategories(),
    getArticles({ limit: 10, status: "published" }),
  ]);

  const latestArticles = articlesRes.data;

  return (
    <div>
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-hero-title">IT-Blog</h1>
        <p className="home-hero-subtitle">
          Блог для розробників: статті, туторіали та найкращі практики з різних напрямків IT.
        </p>
      </div>

      {/* Silo Grid — Category Pillars (Level 1) */}
      <h2 className="home-section-title">Тематичні розділи</h2>
      <div className="silo-grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="silo-card"
            style={{ borderTop: `4px solid ${category.color || "#d6d3d1"}` }}
          >
            <p className="silo-card-title">{category.name}</p>
            <p className="silo-card-desc">{category.description}</p>
            <span className="silo-card-count">
              {category.articlesCount} {pluralArticles(category.articlesCount)}
            </span>
          </Link>
        ))}
      </div>

      {/* Latest Articles (Level 2 links from hub) */}
      <h2 className="home-section-title">Останні статті</h2>
      <div className="latest-articles">
        {latestArticles.map((article) => (
          <div key={article.id} className="latest-article-item">
            <Link
              href={`/categories/${article.category.slug}`}
              className="latest-article-category"
              style={{ color: article.category.color || "#0369a1" }}
            >
              {article.category.name}
            </Link>
            <p className="latest-article-title">
              <Link href={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </p>
            <p className="latest-article-excerpt">{article.excerpt}</p>
            <div className="latest-article-meta">
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} /> {article.readingTime} хв
              </span>
              <span>👁 {article.viewsCount.toLocaleString("uk-UA")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function pluralArticles(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return "статей";
  if (mod10 === 1) return "стаття";
  if (mod10 >= 2 && mod10 <= 4) return "статті";
  return "статей";
}
