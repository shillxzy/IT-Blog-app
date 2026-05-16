// ============================================================
// app/admin/tags/page.tsx — Tags CRUD
// ============================================================

import Link from "next/link";
import { getTags } from "@/lib/api";
import { Plus, Pencil, Tags as TagsIcon } from "lucide-react";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";

export const dynamic = "force-dynamic";

export default async function TagsAdminPage() {
  const tags = await getTags();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Теги</h1>
          <p className="text-stone-500 text-sm mt-0.5">Всього: {tags.length}</p>
        </div>
        <Link
          href="/admin/tags/new"
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Новий тег
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {tags.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <TagsIcon size={40} className="mx-auto mb-3 opacity-30" />
            <p>Тегів немає. Створіть перший!</p>
          </div>
        ) : (
          <div className="p-6 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full px-4 py-2 group"
              >
                <span className="text-sm font-medium text-stone-700">
                  #{tag.name}
                </span>
                <span className="text-xs text-stone-400">
                  ({tag.articlesCount})
                </span>
                <div className="flex items-center gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/tags/${tag.id}/edit`}
                    className="text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    <Pencil size={12} />
                  </Link>
                  <DeleteEntityButton id={tag.id} name={tag.name} endpoint="tags" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
