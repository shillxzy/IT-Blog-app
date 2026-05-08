// ============================================================
// app/admin/page.tsx — Admin Dashboard
// ============================================================

import Link from "next/link";
import { getArticles, getCategories, getAuthors, getTags } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { FileText, FolderOpen, Tags, Users, Plus, Eye, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [articlesRes, categories, authors, tags] = await Promise.all([
    getArticles({ limit: 5, status: "published" }),
    getCategories(),
    getAuthors(),
    getTags(),
  ]);

  const recentArticles = articlesRes.data;
  const totalArticles = articlesRes.meta.total;

  const stats = [
    {
      label: "Статті",
      value: totalArticles,
      icon: FileText,
      href: "/admin/articles",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Категорії",
      value: categories.length,
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Теги",
      value: tags.length,
      icon: Tags,
      href: "/admin/tags",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Автори",
      value: authors.length,
      icon: Users,
      href: "/admin/authors",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Дашборд</h1>
          <p className="text-stone-500 text-sm mt-0.5">Загальний огляд блогу</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Нова стаття
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow group"
          >
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-stone-900">{value}</p>
            <p className="text-sm text-stone-500 mt-0.5 group-hover:text-stone-700 transition-colors">
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent articles */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Останні статті</h2>
          <Link
            href="/admin/articles"
            className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            Всі статті →
          </Link>
        </div>

        <div className="divide-y divide-stone-100">
          {recentArticles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="font-medium text-stone-800 hover:text-amber-700 transition-colors line-clamp-1"
                >
                  {article.title}
                </Link>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-400">
                  <span>{article.category.name}</span>
                  {article.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(article.publishedAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="flex items-center gap-1 text-xs text-stone-400">
                  <Eye size={12} />
                  {article.viewsCount.toLocaleString("uk-UA")}
                </span>
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
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
                >
                  Редагувати
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
