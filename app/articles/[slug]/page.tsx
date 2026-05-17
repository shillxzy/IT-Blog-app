import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/api";
import { AuthorBlock } from "@/components/ui/AuthorBlock";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map(({ articleSlug }) => ({
    slug: articleSlug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    return {
      title: `${article.title} | IT-Blog`,
      description: article.excerpt,
    };
  } catch (e) {
    return {
      title: "Статтю не знайдено",
    };
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch (error) {
    notFound();
  }

  return (
    <article style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <header className="article-header">
        <div className="article-meta">
          <Link href={`/categories/${article.category.slug}`} style={{ color: "#d97706" }}>
            {article.category.name}
          </Link>
          <span>•</span>
          <span>{article.readingTime} хв читання</span>
        </div>
        
        <h1 className="article-title">{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>

        {article.cover && (
          <div className="article-cover">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="article-tags">
          {article.tags.map(tag => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag-badge">
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Author Block - E-E-A-T */}
      <AuthorBlock 
        author={article.author}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
      />
    </article>
  );
}
