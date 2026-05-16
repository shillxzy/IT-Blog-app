// app/categories/[slug]/[articleSlug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getRelatedArticles } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleSlug } = await params;
  try {
    const article = await getArticleBySlug(articleSlug);
    return {
      title: article.metaTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt,
      openGraph: {
        title: article.metaTitle ?? article.title,
        description: article.metaDescription ?? article.excerpt,
        images: article.cover ? [article.cover] : [],
        type: "article",
        publishedTime: article.publishedAt ?? undefined,
        authors: [article.author.name],
      },
    };
  } catch {
    return { title: "Стаття — IT Blog" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug, articleSlug } = await params;

  let article;
  try {
    article = await getArticleBySlug(articleSlug);
  } catch {
    notFound();
  }

  const related = await getRelatedArticles(article.id, article.category.id);

  return (
    <article className="article-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link href="/">Головна</Link>
        <span aria-hidden>/</span>
        <Link href={`/categories/${slug}`}>{article.category.name}</Link>
        <span aria-hidden>/</span>
        <span>{article.title}</span>
      </nav>

      {/* Header */}
      <header className="article-header">
        <span
          className="category-badge"
          style={{ backgroundColor: article.category.color ?? "#6366f1" }}
        >
          <Link href={`/categories/${slug}`} style={{ color: "inherit" }}>
            {article.category.name}
          </Link>
        </span>

        <h1 className="article-title">{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>

        {/* Author + meta row */}
        <div className="article-byline">
          <Link href={`/authors/${article.author.slug}`} className="byline-author">
            {article.author.avatar && (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={44}
                height={44}
                className="avatar-md"
              />
            )}
            <div>
              <p className="byline-name">{article.author.name}</p>
              <p className="byline-meta">
                {article.publishedAt
                  ? formatDate(article.publishedAt)
                  : "Дата невідома"}
                {" · "}
                {article.readingTime} хв читання
                {" · "}
                {article.viewsCount.toLocaleString("uk-UA")} переглядів
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Cover */}
      {article.cover && (
        <div className="article-cover-wrap">
          <Image
            src={article.cover}
            alt={article.title}
            fill
            className="article-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="article-tags">
          {article.tags.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag-badge">
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* ── Author bio block (E-E-A-T) ── */}
      <aside className="author-bio-block">
        <Link href={`/authors/${article.author.slug}`} className="author-bio-link">
          {article.author.avatar && (
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={64}
              height={64}
              className="avatar-lg"
            />
          )}
        </Link>
        <div className="author-bio-content">
          <p className="author-bio-label">Автор статті</p>
          <Link
            href={`/authors/${article.author.slug}`}
            className="author-bio-name"
          >
            {article.author.name}
          </Link>
          <p className="author-bio-text">{article.author.bio}</p>

          <div className="author-bio-links">
            {article.author.social?.github && (
              <a
                href={`https://github.com/${article.author.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="author-social-btn"
              >
                GitHub
              </a>
            )}
            {article.author.social?.linkedin && (
              <a
                href={`https://linkedin.com/in/${article.author.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="author-social-btn"
              >
                LinkedIn
              </a>
            )}
            <Link
              href={`/authors/${article.author.slug}`}
              className="author-social-btn"
            >
              Всі статті автора →
            </Link>
          </div>

          <p className="author-bio-dates">
            Опубліковано:{" "}
            {article.publishedAt ? formatDate(article.publishedAt) : "—"}
            {" · "}
            Оновлено:{" "}
            {article.updatedAt ? formatDate(article.updatedAt) : "—"}
          </p>
        </div>
      </aside>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="related-section">
          <h2 className="related-title">Схожі статті</h2>
          <div className="related-grid">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/categories/${rel.category.slug}/${rel.slug}`}
                className="related-card"
              >
                {rel.cover && (
                  <div className="related-card-image-wrap">
                    <Image
                      src={rel.cover}
                      alt={rel.title}
                      fill
                      className="article-card-image"
                    />
                  </div>
                )}
                <div className="related-card-body">
                  <h3 className="related-card-title">{rel.title}</h3>
                  <p className="meta-time">{rel.readingTime} хв читання</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
