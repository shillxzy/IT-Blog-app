import type { Metadata } from "next";
import type { ArticleCard } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAuthorBySlug, getAuthorArticles } from "@/lib/api";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";
import { Github, Linkedin, Globe } from "lucide-react";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const author = await getAuthorBySlug(slug);
    return { title: author.name, description: author.bio };
  } catch {
    return { title: "Автор" };
  }
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr ?? "1");

  let author;
  try {
    author = await getAuthorBySlug(slug);
  } catch {
    notFound();
  }

  const articlesRes = await getAuthorArticles(slug, page, 10).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
  }));

  return (
    <div className="author-page">
      <div className="author-profile">
        {author.avatar && (
          <Image
            src={author.avatar}
            alt={author.name}
            width={96}
            height={96}
            className="author-avatar"
          />
        )}
        <div className="author-info">
          <h1 className="author-name">{author.name}</h1>
          {author.bio && <p className="author-bio">{author.bio}</p>}
          <p className="author-count">{author.articlesCount} статей опубліковано</p>
          <div className="author-social">
            {author.website && (
              <a href={author.website} target="_blank" rel="noopener noreferrer" aria-label="Сайт">
                <Globe size={18} />
              </a>
            )}
            {author.social?.github && (
              <a href={`https://github.com/${author.social.github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
            )}
            {author.social?.linkedin && (
              <a href={`https://linkedin.com/in/${author.social.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      <h2 className="section-title">Статті автора</h2>

      {articlesRes.data.length === 0 ? (
        <p className="empty-state">Статей ще немає.</p>
      ) : (
        <div className="articles-grid">
          {articlesRes.data.map((article: ArticleCard) => (
            <ArticleCardComponent key={article.id} article={article} />
          ))}
        </div>
      )}
      <Pagination meta={articlesRes.meta} />
    </div>
  );
}