// ============================================================
// app/admin/categories/page.tsx — Categories CRUD
// ============================================================

import Link from "next/link";
import { getCategories } from "@/lib/api";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";

export const dynamic = "force-dynamic";

export default async function CategoriesAdminPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Категорії</h1>
          <p className="text-stone-500 text-sm mt-0.5">Всього: {categories.length}</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Нова категорія
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>Категорій немає. Створіть першу!</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-stone-500">Назва</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Статей</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Колір</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-800">{cat.name}</td>
                  <td className="px-4 py-4 text-stone-500 font-mono text-xs">/{cat.slug}</td>
                  <td className="px-4 py-4 text-stone-600">{cat.articlesCount}</td>
                  <td className="px-4 py-4">
                    {cat.color ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-200"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-stone-400 font-mono">{cat.color}</span>
                      </div>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeleteEntityButton
                        id={cat.id}
                        name={cat.name}
                        endpoint="categories"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
