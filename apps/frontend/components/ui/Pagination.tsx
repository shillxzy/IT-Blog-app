"use client";
// ============================================================
// components/ui/Pagination.tsx
// ============================================================

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  meta: PaginationMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (meta.totalPages <= 1) return null;

  // Build page range (show up to 5 pages)
  const delta = 2;
  const range: (number | "...")[] = [];
  for (let i = 1; i <= meta.totalPages; i++) {
    if (
      i === 1 ||
      i === meta.totalPages ||
      (i >= meta.page - delta && i <= meta.page + delta)
    ) {
      range.push(i);
    } else if (
      (i === meta.page - delta - 1 || i === meta.page + delta + 1) &&
      range[range.length - 1] !== "..."
    ) {
      range.push("...");
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-12"
    >
      <button
        onClick={() => navigate(meta.page - 1)}
        disabled={!meta.hasPrev}
        className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Попередня сторінка"
      >
        <ChevronLeft size={18} />
      </button>

      {range.map((item, i) =>
        item === "..." ? (
          <span key={`dots-${i}`} className="px-3 py-2 text-stone-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => navigate(item)}
            className={`min-w-[2.5rem] h-10 rounded-lg text-sm font-medium transition-colors ${
              item === meta.page
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => navigate(meta.page + 1)}
        disabled={!meta.hasNext}
        className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Наступна сторінка"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
