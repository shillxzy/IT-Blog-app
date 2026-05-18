import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles } from "@/lib/api";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { TagBadge } from "@/components/ui/TagBadge";
import { ViewCounter } from "@/components/ui/ViewCounter";
import { formatDate } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ slug: string; id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await getArticleBySlug(id);
    return {
      title: article.metaTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt,
      openGraph: {
        title: article.metaTitle ?? article.title,
        description: article.metaDescription ?? article.excerpt,
        images: article.cover ? [{ url: article.cover }] : [],
        type: "article",
        publishedTime: article.publishedAt ?? undefined,
        authors: [article.author.name],
      },
    };
  } catch {
    return { title: "Стаття" };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  let article;
  try {
    article = await getArticleBySlug(id);
  } catch {
    notFound();
  }

  const related = await getRelatedArticles(article.slug).catch(() => []);

  return (
    <div className="article-layout">
      <article className="article-main">
        <header className="article-header">
          <div className="article-meta-top">
            <Link
              href={`/categories/${article.category.slug}`}
              className="article-category-badge"
              style={{
                backgroundColor: `${article.category.color ?? "#57534e"}22`,
                color: article.category.color ?? "#57534e",
              }}
            >
              {article.category.name}
            </Link>
            <span className="article-reading-time">
              <Clock size={13} />
              {article.readingTime} хв читання
            </span>
          </div>

          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>

          <div className="article-meta-bottom">
            <Link href={`/authors/${article.author.slug}`} className="article-author-link">
              {article.author.avatar && (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              )}
              <span>{article.author.name}</span>
            </Link>
            {article.publishedAt && (
              <span className="article-date">
                <Calendar size={13} />
                {formatDate(article.publishedAt)}
              </span>
            )}
            <ViewCounter slug={article.slug} initialCount={article.viewsCount} />
          </div>
        </header>

        {article.cover && (
          <div className="article-cover">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        <div
          className="article-content prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        <div className="article-author-card">
          <AuthorCard author={article.author} />
        </div>
      </article>

      <aside className="article-sidebar">
        {related.length > 0 && (
          <div className="sidebar-section">
            <h3 className="sidebar-title">Схожі статті</h3>
            <RelatedArticles articles={related} />
          </div>
        )}
      </aside>
    </div>
  );
}