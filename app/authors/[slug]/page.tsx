// ============================================================
// app/authors/[slug]/page.tsx — Author Profile (Level 3 Auxiliary)
// ============================================================

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAuthorBySlug, getArticles, getAllAuthorSlugs } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Clock } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const author = await getAuthorBySlug(slug);
    return { title: `${author.name} — IT-Blog`, description: author.bio };
  } catch {
    return { title: "Автора не знайдено" };
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let author;
  try {
    author = await getAuthorBySlug(slug);
  } catch {
    notFound();
  }

  const { data: articles } = await getArticles({
    authorSlug: slug,
    status: "published",
    limit: 50,
  });

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: "Автори", href: "#" }, { label: author.name }]} />

      {/* Author profile */}
      <section style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <div className="author-avatar" style={{ width: "80px", height: "80px" }}>
          {author.avatar ? (
            <Image src={author.avatar} alt={author.name} fill style={{ objectFit: "cover" }} sizes="80px" />
          ) : (
            <div className="author-avatar-fallback" style={{ fontSize: "1.5rem" }}>
              {author.name[0]}
            </div>
          )}
        </div>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>{author.name}</h1>
          <p>{author.bio}</p>
          <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem" }}>
            {author.social?.twitter && (
              <a href={`https://twitter.com/${author.social.twitter}`} target="_blank" rel="noopener noreferrer">Twitter</a>
            )}
            {author.social?.github && (
              <a href={`https://github.com/${author.social.github}`} target="_blank" rel="noopener noreferrer">GitHub</a>
            )}
            {author.social?.linkedin && (
              <a href={`https://linkedin.com/in/${author.social.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
            {author.website && (
              <a href={author.website} target="_blank" rel="noopener noreferrer">Сайт</a>
            )}
          </div>
        </div>
      </section>

      {/* Author's articles — links back into silos */}
      <section style={{ marginTop: "1.5rem" }}>
        <h2>Статті автора ({articles.length})</h2>
        {articles.length === 0 ? (
          <p>Автор поки не має опублікованих статей.</p>
        ) : (
          <div className="latest-articles">
            {articles.map((a) => (
              <div key={a.id} className="latest-article-item">
                <Link
                  href={`/categories/${a.category.slug}`}
                  className="latest-article-category"
                  style={{ color: a.category.color || "#0369a1" }}
                >
                  {a.category.name}
                </Link>
                <p className="latest-article-title">
                  <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                </p>
                <p className="latest-article-excerpt">{a.excerpt}</p>
                <div className="latest-article-meta">
                  {a.publishedAt && (
                    <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
                  )}
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> {a.readingTime} хв
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
