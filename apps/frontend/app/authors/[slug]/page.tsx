// app/authors/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuthorBySlug, getArticles } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const author = await getAuthorBySlug(slug);
    return {
      title: `${author.name} — IT Blog`,
      description: author.bio,
    };
  } catch {
    return { title: "Автор — IT Blog" };
  }
}

export const revalidate = 3600;

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;

  let author;
  try {
    author = await getAuthorBySlug(slug);
  } catch {
    notFound();
  }

  const articlesRes = await getArticles({
    authorSlug: slug,
    status: "published",
    limit: 20,
  });

  return (
    <div className="author-page">
      <div className="author-profile">
        {author.avatar && (
          <Image
            src={author.avatar}
            alt={author.name}
            width={96}
            height={96}
            className="avatar-lg"
          />
        )}
        <div className="author-info">
          <h1 className="author-name-lg">{author.name}</h1>
          {author.bio && <p className="author-bio">{author.bio}</p>}
          <div className="author-links">
            {author.website && (
              <a href={author.website} target="_blank" rel="noopener noreferrer" className="author-link-btn">
                Сайт
              </a>
            )}
            {author.social?.github && (
              <a href={`https://github.com/${author.social.github}`} target="_blank" rel="noopener noreferrer" className="author-link-btn">
                GitHub
              </a>
            )}
          </div>
          <p className="author-count">{articlesRes.meta.total} статей</p>
        </div>
      </div>

      <h2 className="section-title">Статті автора</h2>

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
                <span className="meta-time">
                  {article.publishedAt ? formatDate(article.publishedAt) : ""}
                </span>
                <span className="meta-dot">·</span>
                <span className="meta-time">{article.readingTime} хв</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
