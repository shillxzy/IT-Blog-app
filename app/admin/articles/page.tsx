// ============================================================
// app/admin/articles/page.tsx — Article management list
// ============================================================

import Link from "next/link";
import { Suspense } from "react";
import { getArticles } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import {
  Plus,
  Eye,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";

export const dynamic = "force-dynamic";

interface ArticlesAdminPageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function ArticlesAdminPage({
  searchParams,
}: ArticlesAdminPageProps) {
  const { page: pageStr, status } = await searchParams;
  const page = Number(pageStr ?? "1");

  const { data: articles, meta } = await getArticles({
    page,
    limit: 20,
    status: status as any,
  });

  const STATUS_FILTERS = [
    { label: "Всі", value: "" },
    { label: "Опубліковані", value: "published" },
    { label: "Чернетки", value: "draft" },
    { label: "Архів", value: "archived" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Статті</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Всього: {meta.total}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Нова стаття
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map(({ label, value }) => (
          <Link
            key={value}
            href={value ? `/admin/articles?status=${value}` : "/admin/articles"}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
              (status ?? "") === value
                ? "bg-stone-900 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {articles.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <p>Статей не знайдено</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-stone-500">Назва</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Категорія</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Автор</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Статус</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Дата</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Перегляди</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="font-medium text-stone-800 hover:text-amber-700 transition-colors line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <p className="text-xs text-stone-400 mt-0.5">/{article.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${article.category.color ?? "#57534e"}22`,
                        color: article.category.color ?? "#57534e",
                      }}
                    >
                      {article.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-stone-600">{article.author.name}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        article.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : article.status === "draft"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {article.status === "published"
                        ? "Опублікована"
                        : article.status === "draft"
                        ? "Чернетка"
                        : "Архів"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-stone-500 text-xs">
                    {article.publishedAt
                      ? formatDate(article.publishedAt)
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-stone-500">
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {article.viewsCount.toLocaleString("uk-UA")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/categories/${article.category.slug}/${article.slug}`}
                        target="_blank"
                        className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                        aria-label="Переглянути"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                        aria-label="Редагувати"
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeleteArticleButton id={article.id} title={article.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Suspense>
        <Pagination meta={meta} />
      </Suspense>
    </div>
  );
}
