// ============================================================
// components/blog/ArticleCardComponent.tsx — Server Component
// ============================================================

import Image from "next/image";
import Link from "next/link";
import type { ArticleCard } from "@/types";
import { Clock, Eye, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleCard;
}

export function ArticleCardComponent({ article }: ArticleCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden border border-stone-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Cover */}
      <Link
        href={`/categories/${article.category.slug}/${article.slug}`}
        className="relative block aspect-[16/9] overflow-hidden"
      >
        {article.cover ? (
          <Image
            src={article.cover}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-200" />
        )}
        {/* Category badge overlaid on image */}
        <span
          className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: `${article.category.color ?? "#57534e"}dd`,
            color: "#fff",
          }}
        >
          {article.category.name}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/categories/${article.category.slug}/${article.slug}`}>
          <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2 leading-snug">
            {article.title}
          </h3>
        </Link>

        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-stone-400 border-t border-stone-100 pt-3">
          <Link
            href={`/authors/${article.author.slug}`}
            className="flex items-center gap-2 hover:text-stone-700 transition-colors"
          >
            {article.author.avatar ? (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center text-xs font-bold text-stone-600">
                {article.author.name[0]}
              </span>
            )}
            <span className="font-medium text-stone-600">{article.author.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            {article.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(article.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {article.readingTime} хв
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {article.viewsCount.toLocaleString("uk-UA")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
