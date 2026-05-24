import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArticleCard } from "@/types";

interface RelatedArticlesProps {
  articles: ArticleCard[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <div className="related-section">
      <h2 className="related-title">Читайте також</h2>
      <div className="related-grid">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="related-card"
          >
            <p className="related-card-title">{article.title}</p>
            <p className="related-card-excerpt">{article.excerpt}</p>
            {article.publishedAt && (
              <span className="related-card-date">
                {formatDate(article.publishedAt)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
