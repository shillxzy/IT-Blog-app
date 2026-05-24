// ============================================================
// app/categories/[slug]/page.tsx — Category Silo Page (Level 1)
// ============================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getArticles,
  getAllCategorySlugs,
} from "@/lib/api";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Clock } from "lucide-react";

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    return { title: "Категорія не знайдена" };
  }

  return {
    title: `${category.name} — IT-Blog`,
    description: category.description,
    alternates: { canonical: absoluteUrl(`/categories/${slug}`) },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr ?? "1");

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  const { data: articles, meta } = await getArticles({
    categorySlug: slug,
    page,
    limit: 12,
    status: "published",
  });

  return (
    <div>
      {/* Breadcrumb — silo navigation */}
      <Breadcrumbs items={[{ label: category.name }]} />

      {/* Category header */}
      <section style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          {category.color && (
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: category.color,
                flexShrink: 0,
              }}
              aria-hidden
            />
          )}
          <span style={{ fontSize: "0.8rem", color: "#a8a29e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Категорія
          </span>
        </div>
        <h1>{category.name}</h1>
        {category.description && (
          <p style={{ fontSize: "1.1rem", color: "#57534e" }}>{category.description}</p>
        )}
        <p style={{ fontSize: "0.85rem", color: "#a8a29e", margin: 0 }}>
          {category.articlesCount} {pluralArticles(category.articlesCount)}
        </p>
      </section>

      {/* Articles — contextual links within silo */}
      {articles.length === 0 ? (
        <section>
          <p>У цій категорії ще немає статей.</p>
        </section>
      ) : (
        <div className="latest-articles">
          {articles.map((article) => (
            <div key={article.id} className="latest-article-item">
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem", padding: "0.75rem" }}>
          {meta.hasPrev && <Link href={`/categories/${slug}?page=${page - 1}`}>← Назад</Link>}
          <span style={{ fontSize: "0.875rem", color: "#78716c" }}>
            Сторінка {meta.page} з {meta.totalPages}
          </span>
          {meta.hasNext && <Link href={`/categories/${slug}?page=${page + 1}`}>Далі →</Link>}
        </nav>
      )}
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
