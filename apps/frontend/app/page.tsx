import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, getCategories } from "@/lib/api";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "IT Blog — Новини про технології",
  description: "Актуальні статті про JavaScript, React, Node.js, DevOps та AI для розробників.",
};

export const revalidate = 3600;

interface HomePageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageStr, category } = await searchParams;
  const page = Number(pageStr ?? "1");

  const [articlesRes, categories] = await Promise.all([
    getArticles({ page, limit: 10, status: "published", categorySlug: category }),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="home-hero">
        <h1 className="home-hero-title">IT Blog</h1>
        <p className="home-hero-sub">
          Практичні статті про Frontend, Backend, DevOps та AI українською мовою.
        </p>
      </section>

      {/* Category filter */}
      <div className="category-filter">
        <Link
          href="/"
          className={`category-pill ${!category ? "category-pill--active" : ""}`}
        >
          Всі
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`category-pill ${category === cat.slug ? "category-pill--active" : ""}`}
            style={category === cat.slug ? { backgroundColor: cat.color ?? "#57534e", color: "#fff" } : {}}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Articles grid */}
      {articlesRes.data.length === 0 ? (
        <p className="empty-state">Статей не знайдено.</p>
      ) : (
        <div className="articles-grid">
          {articlesRes.data.map((article) => (
            <ArticleCardComponent key={article.id} article={article} />
          ))}
        </div>
      )}

      <Pagination meta={articlesRes.meta} />
    </div>
  );
}