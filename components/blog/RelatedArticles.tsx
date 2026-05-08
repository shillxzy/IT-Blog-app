// ============================================================
// components/blog/RelatedArticles.tsx — Server Component
// ============================================================

import Image from "next/image";
import Link from "next/link";
import type { ArticleCard } from "@/types";
import { Clock } from "lucide-react";

interface RelatedArticlesProps {
  articles: ArticleCard[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <ul className="space-y-4">
      {articles.map((article) => (
        <li key={article.id}>
          <Link
            href={`/categories/${article.category.slug}/${article.slug}`}
            className="flex gap-3 group"
          >
            <div className="relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={article.cover}
                alt={article.title}
                fill
                sizes="80px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                {article.title}
              </p>
              <span className="flex items-center gap-1 text-xs text-stone-400 mt-1">
                <Clock size={11} />
                {article.readingTime} хв
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
