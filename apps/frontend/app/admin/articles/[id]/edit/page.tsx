// ============================================================
// app/admin/articles/[id]/edit/page.tsx — Edit article
// ============================================================

import { notFound } from "next/navigation";
import { getArticleBySlug, getCategories, getTags, getAuthors } from "@/lib/api";
import { ArticleForm } from "@/components/admin/ArticleForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  let article;
  try {
    article = await getArticleBySlug(id);
  } catch {
    notFound();
  }

  const [categories, tags, authors] = await Promise.all([
    getCategories(),
    getTags(),
    getAuthors(),
  ]);

  async function updateArticle(formData: FormData) {
    "use server";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
      {
        method: "PATCH",
        body: formData,
      }
    );
    if (!res.ok) throw new Error("Не вдалося оновити статтю");
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-3"
        >
          <ChevronLeft size={15} />
          Всі статті
        </Link>
        <h1 className="text-2xl font-bold text-stone-900">Редагування статті</h1>
        <p className="text-stone-500 text-sm mt-0.5 line-clamp-1">{article.title}</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <ArticleForm
          article={article}
          categories={categories}
          tags={tags}
          authors={authors}
          onSubmit={updateArticle}
        />
      </div>
    </div>
  );
}
