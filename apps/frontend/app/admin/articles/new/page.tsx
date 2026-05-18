// ============================================================
// app/admin/articles/new/page.tsx — Create new article
// ============================================================

import { redirect } from "next/navigation";
import { getCategories, getTags, getAuthors } from "@/lib/api";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const [categories, tags, authors] = await Promise.all([
    getCategories(),
    getTags(),
    getAuthors(),
  ]);

  async function createArticle(formData: FormData) {
    "use server";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Не вдалося створити статтю");
    const article = await res.json();
    redirect(`/admin/articles/${article.id}/edit`);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Нова стаття</h1>
        <p className="text-stone-500 text-sm mt-0.5">Заповніть всі обов&apos;язкові поля</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <ArticleForm
          categories={categories}
          tags={tags}
          authors={authors}
          onSubmit={createArticle}
        />
      </div>
    </div>
  );
}
