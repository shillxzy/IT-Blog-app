import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/api";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourblog.com";

export const metadata: Metadata = {
  title: "Всі категорії",
  description:
    "Огляд усіх тематичних розділів IT Blog: Frontend, Backend, DevOps, AI & ML, Productivity.",
  alternates: { canonical: `${SITE_URL}/categories` },
};

export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  const breadcrumbItems = [
    { name: "Головна", url: `${SITE_URL}/` },
    { name: "Категорії", url: `${SITE_URL}/categories` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />

      <Breadcrumb
        items={[
          { name: "Головна", href: "/" },
          { name: "Категорії", href: "/categories" },
        ]}
      />

      <div className="category-header">
        <div className="category-header-accent" style={{ backgroundColor: "#57534e" }} />
        <h1 className="category-title">Категорії</h1>
        <p className="category-description">
          Тематичні розділи блогу — кожен присвячений окремому напрямку розробки.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="category-card"
          >
            <div
              className="category-card-accent"
              style={{ backgroundColor: cat.color ?? "#57534e" }}
            />
            <p className="category-card-name">{cat.name}</p>
            {cat.description && (
              <p className="category-card-desc">{cat.description}</p>
            )}
            <p className="category-card-count">{cat.articlesCount} статей</p>
          </Link>
        ))}
      </div>
    </>
  );
}
