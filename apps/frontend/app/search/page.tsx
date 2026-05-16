// ============================================================
// app/search/page.tsx — Search results page
// ============================================================

import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getArticles } from "@/lib/api";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Пошук — YourBlog",
  description: "Шукайте статті на YourBlog",
  robots: { index: false }, // matches robots.ts
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageStr } = await searchParams;
  const page = Number(pageStr ?? "1");
  const query = q?.trim() ?? "";

  let articles: Awaited<ReturnType<typeof getArticles>> | null = null;

  if (query) {
    articles = await getArticles({
      search: query,
      page,
      limit: 12,
      status: "published",
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-4">
          Пошук
        </h1>

        <Suspense>
          <SearchBar initialValue={query} />
        </Suspense>
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-24">
          <Search size={48} className="mx-auto text-stone-200 mb-4" />
          <p className="text-stone-400 text-lg">
            Введіть запит, щоб знайти статті
          </p>
        </div>
      ) : articles && articles.data.length === 0 ? (
        <div className="text-center py-24">
          <Search size={48} className="mx-auto text-stone-200 mb-4" />
          <p className="text-stone-800 font-medium text-lg mb-2">
            Нічого не знайдено
          </p>
          <p className="text-stone-400 text-sm">
            За запитом &laquo;{query}&raquo; статей не знайдено.{" "}
            <Link href="/" className="text-amber-600 hover:underline">
              Переглянути всі статті
            </Link>
          </p>
        </div>
      ) : articles ? (
        <>
          <p className="text-sm text-stone-400 mb-6">
            За запитом &laquo;{query}&raquo; знайдено{" "}
            <strong className="text-stone-700">{articles.meta.total}</strong> результатів
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.data.map((article) => (
              <ArticleCardComponent key={article.id} article={article} />
            ))}
          </div>

          <Suspense>
            <Pagination meta={articles.meta} />
          </Suspense>
        </>
      ) : null}
    </div>
  );
}
