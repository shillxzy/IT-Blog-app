"use client";
// ============================================================
// components/ui/SearchBar.tsx
// ============================================================

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";

interface SearchBarProps {
  initialValue?: string;
}

export function SearchBar({ initialValue = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук статей..."
        className="w-full pl-12 pr-12 py-3.5 text-base border border-stone-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
        autoFocus
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            router.push("/search");
          }}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
          aria-label="Очистити"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="submit"
        disabled={!query.trim() || isPending}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-900 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-stone-700 disabled:opacity-40 transition-colors"
        aria-label="Знайти"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : "→"}
      </button>
    </form>
  );
}
