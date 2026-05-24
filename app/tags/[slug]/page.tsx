// ============================================================
// app/tags/[slug]/page.tsx — Tag Feed Page (Level 3 Auxiliary)
// ============================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTagBySlug, getArticles, getAllTagSlugs } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Clock } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllTagSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tag = await getTagBySlug(slug);
    return {
      title: `#${tag.name} — IT-Blog`,
      description: `Статті з тегом ${tag.name}`,
    };
  } catch {
    return { title: "Тег не знайдено" };
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;

  let tag;
  try {
    tag = await getTagBySlug(slug);
  } catch {
    notFound();
  }

  const currentPage = Math.max(1, Number(rawPage) || 1);
  const { data: articles, meta } = await getArticles({
    tagSlug: slug,
    page: currentPage,
    limit: 12,
    status: "published",
  });

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: "Теги", href: "#" }, { label: `#${tag.name}` }]} />

      <section>
        <h1>#{tag.name}</h1>
        <p>Статті з тегом «{tag.name}»</p>
      </section>

      <div style={{ marginTop: "1rem" }}>
        {articles.length === 0 ? (
          <section>
            <p>Статей із цим тегом поки немає.</p>
          </section>
        ) : (
          <div className="latest-articles">
            {articles.map((article) => (
              <div key={article.id} className="latest-article-item">
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="latest-article-category"
                  style={{ color: article.category.color || "#0369a1" }}
                >
                  {article.category.name}
                </Link>
                <p className="latest-article-title">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </p>
                <p className="latest-article-excerpt">{article.excerpt}</p>
                <div className="latest-article-meta">
                  {article.publishedAt && (
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                  )}
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> {article.readingTime} хв
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem", padding: "0.75rem" }}>
            {meta.hasPrev && <Link href={`/tags/${slug}?page=${currentPage - 1}`}>← Назад</Link>}
            <span style={{ fontSize: "0.875rem", color: "#78716c" }}>
              Сторінка {meta.page} з {meta.totalPages}
            </span>
            {meta.hasNext && <Link href={`/tags/${slug}?page=${currentPage + 1}`}>Далі →</Link>}
          </nav>
        )}
      </div>
    </div>
  );
}
