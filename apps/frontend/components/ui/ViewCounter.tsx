"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { incrementViewCount } from "@/lib/api";

interface ViewCounterProps {
  slug: string;
  initialCount: number;
}

export function ViewCounter({ slug, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    incrementViewCount(slug).catch(() => {});
    setCount((c) => c + 1);
  }, [slug]);

  return (
    <span className="flex items-center gap-1 text-sm text-stone-400">
      <Eye size={13} />
      {count.toLocaleString("uk-UA")}
    </span>
  );
}