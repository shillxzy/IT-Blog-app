// ============================================================
// app/categories/[slug]/page.tsx — Category listing page (ISR)
// ============================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import {
  getCategoryBySlug,
  getArticles,
  getAllCategorySlugs,
} from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    return { title: "Категорія не знайдена" };
  }

  return {
    title: `${category.name} — YourBlog`,
    description: category.description,
    alternates: { canonical: absoluteUrl(`/categories/${slug}`) },
    openGraph: {
      title: category.name,
      description: category.description,
      type: "website",
      images: category.cover ? [{ url: category.cover, width: 1200, height: 630, alt: category.name }] : [],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr ?? "1");

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  const { data: articles, meta } = await getArticles({
    categorySlug: slug,
    page,
    limit: 12,
    status: "published",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category header */}
      <header className="mb-10">
        {category.cover && (
          <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
            <Image
              src={category.cover}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="flex items-center gap-3 mb-2">
          {category.color && (
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
              aria-hidden
            />
          )}
          <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest">
            Категорія
          </p>
        </div>

        <h1 className="font-display text-4xl font-bold text-stone-900 mb-3">
          {category.name}
        </h1>

        {category.description && (
          <p className="text-stone-500 text-lg max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}

        <p className="text-sm text-stone-400 mt-3">
          {category.articlesCount} {pluralArticles(category.articlesCount)}
        </p>
      </header>

      {/* Articles */}
      {articles.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <p>У цій категорії ще немає статей</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCardComponent key={article.id} article={article} />
            ))}
          </div>
          <Suspense>
            <Pagination meta={meta} />
          </Suspense>
        </>
      )}
    </div>
  );
}

function pluralArticles(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return "статей";
  if (mod10 === 1) return "стаття";
  if (mod10 >= 2 && mod10 <= 4) return "статті";
  return "статей";
}
