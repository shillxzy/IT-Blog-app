// lib/api.ts — Centralized API client
import type {
  Article,
  ArticleCard,
  ArticleFilters,
  ArticleStatus,
  Author,
  Category,
  PaginatedResponse,
  Tag,
} from "@/types";
import {
  mockArticles,
  mockAuthors,
  mockCategories,
  mockTags,
  toArticleCard,
} from "@/lib/mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true" || API_BASE.trim() === "";

// ── Generic fetch ──────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
      ...options,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    throw new Error(`Cannot connect to API (${API_BASE}). ${msg}`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API [${res.status}]: ${text}`);
  }
  return res.json() as Promise<T>;
}

function paginate<T>(items: T[], page: number, limit: number): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const cur = Math.min(Math.max(page, 1), totalPages);
  const start = (cur - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page: cur, limit, total, totalPages, hasNext: cur < totalPages, hasPrev: cur > 1 },
  };
}

function filterMock(filters: ArticleFilters): Article[] {
  const q = filters.search?.trim().toLowerCase();
  return mockArticles.filter((a) => {
    if (filters.categorySlug && a.category.slug !== filters.categorySlug) return false;
    if (filters.tagSlug && !a.tags.some((t) => t.slug === filters.tagSlug)) return false;
    if (filters.authorSlug && a.author.slug !== filters.authorSlug) return false;
    if (filters.status) { if (a.status !== filters.status) return false; }
    else { if (a.status !== "published") return false; }
    if (q && !`${a.title} ${a.excerpt} ${a.content}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

// ── Articles ───────────────────────────────────────────────

export async function getArticles(
  filters: ArticleFilters = {}
): Promise<PaginatedResponse<ArticleCard>> {
  if (USE_MOCK) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    return paginate(filterMock(filters).map(toArticleCard), page, limit);
  }

  const params = new URLSearchParams();
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.tagSlug) params.set("tag", filters.tagSlug);
  if (filters.authorSlug) params.set("author", filters.authorSlug);
  if (filters.search) params.set("q", filters.search);
  if (filters.status) params.set("status", filters.status);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));

  return apiFetch<PaginatedResponse<ArticleCard>>(`/articles?${params}`, {
    next: { revalidate: 60 },
  });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  if (USE_MOCK) {
    const a = mockArticles.find((a) => a.slug === slug || a.id === slug);
    if (!a) throw new Error("Article not found");
    return a;
  }
  const res = await apiFetch<{ data: Article }>(`/articles/${slug}`, {
    next: { revalidate: 300 },
  });
  return res.data;
}

export async function incrementViewCount(id: string): Promise<void> {
  if (USE_MOCK) return;
  await apiFetch(`/articles/${id}/view`, { method: "POST" });
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string
): Promise<ArticleCard[]> {
  if (USE_MOCK) {
    return mockArticles
      .filter((a) => a.id !== articleId && a.category.id === categoryId && a.status === "published")
      .slice(0, 3)
      .map(toArticleCard);
  }
  const res = await apiFetch<{ data: ArticleCard[] }>(
    `/articles/${articleId}/related?category=${categoryId}&limit=3`,
    { next: { revalidate: 300 } }
  );
  return res.data;
}

// ── Categories ─────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) return mockCategories;
  const res = await apiFetch<{ data: Category[] }>("/categories", { next: { revalidate: 3600 } });
  return res.data;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  if (USE_MOCK) {
    const c = mockCategories.find((c) => c.slug === slug);
    if (!c) throw new Error("Category not found");
    return c;
  }
  const res = await apiFetch<{ data: Category }>(`/categories/${slug}`, { next: { revalidate: 3600 } });
  return res.data;
}

// ── Authors ────────────────────────────────────────────────

export async function getAuthors(): Promise<Author[]> {
  if (USE_MOCK) return mockAuthors;
  const res = await apiFetch<{ data: Author[] }>("/authors", { next: { revalidate: 3600 } });
  return res.data;
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  if (USE_MOCK) {
    const a = mockAuthors.find((a) => a.slug === slug);
    if (!a) throw new Error("Author not found");
    return a;
  }
  const res = await apiFetch<{ data: Author }>(`/authors/${slug}`, { next: { revalidate: 3600 } });
  return res.data;
}

// ── Tags ───────────────────────────────────────────────────

export async function getTags(): Promise<Tag[]> {
  if (USE_MOCK) return mockTags;
  const res = await apiFetch<{ data: Tag[] }>("/tags", { next: { revalidate: 3600 } });
  return res.data;
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  if (USE_MOCK) {
    const t = mockTags.find((t) => t.slug === slug);
    if (!t) throw new Error("Tag not found");
    return t;
  }
  const res = await apiFetch<{ data: Tag }>(`/tags/${slug}`, { next: { revalidate: 3600 } });
  return res.data;
}

// ── Sitemap helpers ────────────────────────────────────────

export async function getAllArticleSlugs(): Promise<
  { categorySlug: string; articleSlug: string }[]
> {
  if (USE_MOCK) {
    return mockArticles
      .filter((a) => a.status === ("published" as ArticleStatus))
      .map((a) => ({ categorySlug: a.category.slug, articleSlug: a.slug }));
  }
  return apiFetch("/articles/slugs", { cache: "no-store" });
}

export async function getAllCategorySlugs(): Promise<string[]> {
  if (USE_MOCK) return mockCategories.map((c) => c.slug);
  return apiFetch("/categories/slugs", { cache: "no-store" });
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  if (USE_MOCK) return mockAuthors.map((a) => a.slug);
  return apiFetch("/authors/slugs", { cache: "no-store" });
}

export async function getAllTagSlugs(): Promise<string[]> {
  if (USE_MOCK) return mockTags.map((t) => t.slug);
  return apiFetch("/tags/slugs", { cache: "no-store" });
}
