// app/page.tsx — Головна сторінка блогу
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArticles, getCategories } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "IT Blog — Новини та статті про технології",
  description:
    "Актуальні статті про JavaScript, React, Node.js, DevOps, AI та кібербезпеку. Читай, навчайся, розвивайся.",
};

export default async function HomePage() {
  const [articlesRes, categories] = await Promise.all([
    getArticles({ limit: 10, status: "published" }),
    getCategories(),
  ]);

  const articles = articlesRes.data;
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="home-page">
      {/* Hero / Featured article */}
      {featured && (
        <section className="featured-section">
          <Link
            href={`/categories/${featured.category.slug}/${featured.slug}`}
            className="featured-card"
          >
            {featured.cover && (
              <div className="featured-image-wrap">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  className="featured-image"
                  priority
                />
                <div className="featured-overlay" />
              </div>
            )}
            <div className="featured-content">
              <span
                className="category-badge"
                style={{ backgroundColor: featured.category.color ?? "#6366f1" }}
              >
                {featured.category.name}
              </span>
              <h1 className="featured-title">{featured.title}</h1>
              <p className="featured-excerpt">{featured.excerpt}</p>
              <div className="featured-meta">
                {featured.author.avatar && (
                  <Image
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    width={28}
                    height={28}
                    className="avatar-sm"
                  />
                )}
                <span>{featured.author.name}</span>
                <span className="meta-dot">·</span>
                <span>{featured.publishedAt ? formatDate(featured.publishedAt) : ""}</span>
                <span className="meta-dot">·</span>
                <span>{featured.readingTime} хв читання</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Categories filter bar */}
      <section className="categories-bar">
        <Link href="/" className="cat-chip cat-chip-active">
          Всі
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="cat-chip">
            {cat.name}
          </Link>
        ))}
      </section>

      {/* Article grid */}
      <section className="articles-grid">
        {rest.map((article) => (
          <Link
            key={article.id}
            href={`/categories/${article.category.slug}/${article.slug}`}
            className="article-card"
          >
            {article.cover && (
              <div className="article-card-image-wrap">
                <Image
                  src={article.cover}
                  alt={article.title}
                  fill
                  className="article-card-image"
                />
              </div>
            )}
            <div className="article-card-body">
              <span
                className="category-badge-sm"
                style={{ color: article.category.color ?? "#6366f1" }}
              >
                {article.category.name}
              </span>
              <h2 className="article-card-title">{article.title}</h2>
              <p className="article-card-excerpt">{article.excerpt}</p>
              <div className="article-card-meta">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={22}
                    height={22}
                    className="avatar-xs"
                  />
                )}
                <span className="meta-author">{article.author.name}</span>
                <span className="meta-dot">·</span>
                <span className="meta-time">{article.readingTime} хв</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
