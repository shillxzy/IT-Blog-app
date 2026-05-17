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
    { label: "Статті", value: totalArticles, icon: FileText, href: "/admin/articles" },
    { label: "Категорії", value: categories.length, icon: FolderOpen, href: "/admin/categories" },
    { label: "Теги", value: tags.length, icon: Tags, href: "/admin/tags" },
    { label: "Автори", value: authors.length, icon: Users, href: "/admin/authors" },
  ];

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Дашборд</h1>
          <p className="dashboard-subtitle">Загальний огляд блогу</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          <Plus size={16} /> Нова стаття
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="stat-card">
            <div className="stat-icon" style={{ background: "#f5f5f4", color: "#44403c" }}>
              <Icon size={20} />
            </div>
            <p className="stat-value">{value}</p>
            <p className="stat-label">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent articles */}
      <div className="recent-articles-card">
        <div className="recent-articles-header">
          <h2>Останні статті</h2>
          <Link href="/admin/articles" className="link-amber">Всі статті →</Link>
        </div>

        <div className="recent-articles-list">
          {recentArticles.map((article) => (
            <div key={article.id} className="recent-item">
              <div className="recent-info">
                <Link href={`/admin/articles/${article.id}/edit`} className="recent-title" style={{display: "block"}}>
                  {article.title}
                </Link>
                <div className="recent-meta">
                  <span>{article.category.name}</span>
                  {article.publishedAt && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={10} />
                      {formatDate(article.publishedAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="recent-actions">
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Eye size={12} />
                  {article.viewsCount.toLocaleString("uk-UA")}
                </span>
                <span className={`badge ${article.status === 'published' ? 'badge-success' : article.status === 'draft' ? 'badge-warning' : 'badge-neutral'}`}>
                  {article.status === "published" ? "Опублікована" : article.status === "draft" ? "Чернетка" : "Архів"}
                </span>
                <Link href={`/admin/articles/${article.id}/edit`}>Редагувати</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
