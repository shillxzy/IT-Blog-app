"use client";
// ============================================================
// components/blog/ViewCounter.tsx
// Increments view count once per session (sessionStorage guard)
// ============================================================

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { incrementViewCount } from "@/lib/api";

interface ViewCounterProps {
  articleId: string;
  initialCount: number;
}

export function ViewCounter({ articleId, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const key = `viewed_${articleId}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    incrementViewCount(articleId)
      .then(() => setCount((c) => c + 1))
      .catch(() => {}); // silently fail
  }, [articleId]);

  return (
    <span className="flex items-center gap-1.5">
      <Eye size={14} />
      {count.toLocaleString("uk-UA")}
    </span>
  );
}
