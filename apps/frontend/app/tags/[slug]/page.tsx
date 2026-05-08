// app/tags/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTagBySlug, getArticles } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tag = await getTagBySlug(slug);
    return {
      title: `#${tag.name} — IT Blog`,
      description: `Статті з тегом ${tag.name}`,
    };
  } catch {
    return { title: "Тег — IT Blog" };
  }
}

export const revalidate = 3600;

export default async function TagPage({ params }: Props) {
  const { slug } = await params;

  let tag;
  try {
    tag = await getTagBySlug(slug);
  } catch {
    notFound();
  }

  const articlesRes = await getArticles({
    tagSlug: slug,
    status: "published",
    limit: 20,
  });

  return (
    <div className="tag-page">
      <div className="tag-header">
        <h1 className="tag-title">
          <span className="tag-hash">#</span>
          {tag.name}
        </h1>
        <p className="tag-count">{articlesRes.meta.total} статей</p>
      </div>

      {articlesRes.data.length === 0 ? (
        <p className="empty-state">Статей з цим тегом ще немає.</p>
      ) : (
        <div className="articles-grid">
          {articlesRes.data.map((article) => (
            <Link
              key={article.id}
              href={`/categories/${article.category.slug}/${article.slug}`}
              className="article-card"
            >
              {article.cover && (
                <div className="article-card-image-wrap">
                  <Image src={article.cover} alt={article.title} fill className="article-card-image" />
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
                    <Image src={article.author.avatar} alt={article.author.name} width={22} height={22} className="avatar-xs" />
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
      )}
    </div>
  );
}
