"use client";
// ============================================================
// components/admin/DeleteEntityButton.tsx
// ============================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteEntityButtonProps {
  id: string;
  name: string;
  endpoint: string; // e.g. "categories", "tags", "authors"
}

export function DeleteEntityButton({ id, name, endpoint }: DeleteEntityButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Видалити «${name}»? Цю дію неможливо скасувати.`)) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Помилка видалення");
      router.refresh();
    } catch {
      alert("Не вдалося видалити запис");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors disabled:opacity-50"
      aria-label="Видалити"
    >
      {isLoading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Trash2 size={15} />
      )}
    </button>
  );
}
