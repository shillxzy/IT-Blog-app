// ============================================================
// app/admin/authors/page.tsx — Authors CRUD
// ============================================================

import Image from "next/image";
import Link from "next/link";
import { getAuthors } from "@/lib/api";
import { Plus, Pencil, Users } from "lucide-react";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";

export const dynamic = "force-dynamic";

export default async function AuthorsAdminPage() {
  const authors = await getAuthors();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Автори</h1>
          <p className="text-stone-500 text-sm mt-0.5">Всього: {authors.length}</p>
        </div>
        <Link
          href="/admin/authors/new"
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Новий автор
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.length === 0 ? (
          <div className="col-span-full py-16 text-center text-stone-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Авторів немає. Додайте першого!</p>
          </div>
        ) : (
          authors.map((author) => (
            <div
              key={author.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 flex items-start gap-4 group hover:shadow-md transition-shadow"
            >
              <Image
                src={author.avatar}
                alt={author.name}
                width={48}
                height={48}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900 truncate">{author.name}</p>
                <p className="text-xs text-stone-400 truncate mb-1">{author.email}</p>
                <p className="text-xs text-stone-500">{author.articlesCount} статей</p>
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/admin/authors/${author.id}/edit`}
                  className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <Pencil size={15} />
                </Link>
                <DeleteEntityButton id={author.id} name={author.name} endpoint="authors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
