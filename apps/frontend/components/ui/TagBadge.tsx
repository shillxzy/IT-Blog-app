"use client";
// ============================================================
// components/ui/TagBadge.tsx
// ============================================================

import Link from "next/link";
import type { Tag } from "@/types";

interface TagBadgeProps {
  tag: Pick<Tag, "id" | "slug" | "name">;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${tag.slug}`}
      className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800 transition-colors"
    >
      #{tag.name}
    </Link>
  );
}
