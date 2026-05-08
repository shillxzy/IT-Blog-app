// app/search/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArticles } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Пошук: ${q} — IT Blog` : "Пошук — IT Blog",
    description: "Пошук статей по IT Blog",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", page = "1" } = await searchParams;

  let articlesRes = null;
  if (q.trim()) {
    articlesRes = await getArticles({
      search: q,
      page: Number(page),
      limit: 10,
      status: "published",
    });
  }

  return (
    <div className="search-page">
      <h1 className="page-title">Пошук</h1>

      {/* Search form */}
      <form method="GET" action="/search" className="search-form">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Пошук статей..."
          className="search-input"
          autoFocus
        />
        <button type="submit" className="search-btn">
          Знайти
        </button>
      </form>

      {/* Results */}
      {q.trim() && articlesRes && (
        <div className="search-results">
          <p className="search-meta">
            {articlesRes.meta.total === 0
              ? `Нічого не знайдено за запитом «${q}»`
              : `Знайдено ${articlesRes.meta.total} статей за запитом «${q}»`}
          </p>

          <div className="search-list">
            {articlesRes.data.map((article) => (
              <Link
                key={article.id}
                href={`/categories/${article.category.slug}/${article.slug}`}
                className="search-item"
              >
                {article.cover && (
                  <div className="search-item-image-wrap">
                    <Image
                      src={article.cover}
                      alt={article.title}
                      fill
                      className="article-card-image"
                    />
                  </div>
                )}
                <div className="search-item-content">
                  <span
                    className="category-badge-sm"
                    style={{ color: article.category.color ?? "#6366f1" }}
                  >
                    {article.category.name}
                  </span>
                  <h2 className="search-item-title">{article.title}</h2>
                  <p className="search-item-excerpt">{article.excerpt}</p>
                  <div className="article-card-meta">
                    {article.author.avatar && (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={20}
                        height={20}
                        className="avatar-xs"
                      />
                    )}
                    <span className="meta-author">{article.author.name}</span>
                    <span className="meta-dot">·</span>
                    <span className="meta-time">
                      {article.publishedAt ? formatDate(article.publishedAt) : ""}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {articlesRes.meta.totalPages > 1 && (
            <div className="pagination">
              {articlesRes.meta.hasPrev && (
                <Link href={`/search?q=${encodeURIComponent(q)}&page=${articlesRes.meta.page - 1}`} className="page-btn">
                  ← Назад
                </Link>
              )}
              <span className="page-info">
                {articlesRes.meta.page} / {articlesRes.meta.totalPages}
              </span>
              {articlesRes.meta.hasNext && (
                <Link href={`/search?q=${encodeURIComponent(q)}&page=${articlesRes.meta.page + 1}`} className="page-btn">
                  Вперед →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
