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
const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true" || API_BASE.trim() === "";

// ── Generic fetch wrapper ──────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
      ...options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown network error";
    throw new Error(`Не вдалося підключитися до API (${API_BASE}). ${message}`);
  }
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error [${res.status}]: ${error}`);
  }
  return res.json() as Promise<T>;
}

function paginate<T>(items: T[], page: number, limit: number): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page: currentPage, limit, total, totalPages, hasNext: currentPage < totalPages, hasPrev: currentPage > 1 },
  };
}

function filterMockArticles(filters: ArticleFilters): Article[] {
  const search = filters.search?.trim().toLowerCase();
  return mockArticles.filter((article) => {
    if (filters.categorySlug && article.category.slug !== filters.categorySlug) return false;
    if (filters.tagSlug && !article.tags.some((t) => t.slug === filters.tagSlug)) return false;
    if (filters.authorSlug && article.author.slug !== filters.authorSlug) return false;
    if (filters.status && article.status !== filters.status) return false;
    if (search && !`${article.title} ${article.excerpt}`.toLowerCase().includes(search)) return false;
    return true;
  });
}

// ── Articles ──────────────────────────────────────────────────────────

export async function getArticles(filters: ArticleFilters = {}): Promise<PaginatedResponse<ArticleCard>> {
  if (USE_MOCK_API) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    return paginate(filterMockArticles(filters).map(toArticleCard), page, limit);
  }

  const params = new URLSearchParams();
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.tagSlug) params.set("tag", filters.tagSlug);
  if (filters.authorSlug) params.set("author", filters.authorSlug);
  if (filters.search) params.set("q", filters.search);
  if (filters.status) params.set("status", filters.status);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));

  return apiFetch<PaginatedResponse<ArticleCard>>(`/articles?${params.toString()}`, {
    next: { revalidate: 60 },
  });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  if (USE_MOCK_API) {
    const article = mockArticles.find((a) => a.slug === slug || a.id === slug);
    if (!article) throw new Error("Article not found");
    return article;
  }
  // Backend returns { data: article }
  const res = await apiFetch<{ data: Article }>(`/articles/${slug}`, { next: { revalidate: 300 } });
  return res.data;
}

export async function incrementViewCount(slug: string): Promise<void> {
  if (USE_MOCK_API) return;
  await apiFetch(`/articles/${slug}/view`, { method: "POST" });
}

export async function getRelatedArticles(slug: string): Promise<ArticleCard[]> {
  if (USE_MOCK_API) {
    const article = mockArticles.find((a) => a.slug === slug);
    if (!article) return [];
    return mockArticles
      .filter((a) => a.id !== article.id && a.category.id === article.category.id)
      .slice(0, 3)
      .map(toArticleCard);
  }
  const res = await apiFetch<{ data: ArticleCard[] }>(`/articles/${slug}/related`, {
    next: { revalidate: 300 },
  });
  return res.data;
}

// ── Categories ────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK_API) return mockCategories;
  const res = await apiFetch<{ data: Category[] }>("/categories", { next: { revalidate: 3600 } });
  return res.data;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  if (USE_MOCK_API) {
    const cat = mockCategories.find((c) => c.slug === slug);
    if (!cat) throw new Error("Category not found");
    return cat;
  }
  const res = await apiFetch<{ data: Category }>(`/categories/${slug}`, { next: { revalidate: 3600 } });
  return res.data;
}

export async function getCategoryArticles(
  slug: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<ArticleCard>> {
  if (USE_MOCK_API) {
    return paginate(
      filterMockArticles({ categorySlug: slug }).map(toArticleCard),
      page,
      limit
    );
  }
  return apiFetch<PaginatedResponse<ArticleCard>>(
    `/categories/${slug}/articles?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

// ── Authors ───────────────────────────────────────────────────────────

export async function getAuthors(): Promise<Author[]> {
  if (USE_MOCK_API) return mockAuthors;
  const res = await apiFetch<{ data: Author[] }>("/authors", { next: { revalidate: 3600 } });
  return res.data;
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  if (USE_MOCK_API) {
    const author = mockAuthors.find((a) => a.slug === slug);
    if (!author) throw new Error("Author not found");
    return author;
  }
  const res = await apiFetch<{ data: Author }>(`/authors/${slug}`, { next: { revalidate: 3600 } });
  return res.data;
}

export async function getAuthorArticles(
  slug: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<ArticleCard>> {
  if (USE_MOCK_API) {
    return paginate(
      filterMockArticles({ authorSlug: slug }).map(toArticleCard),
      page,
      limit
    );
  }
  return apiFetch<PaginatedResponse<ArticleCard>>(
    `/authors/${slug}/articles?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

// ── Tags ──────────────────────────────────────────────────────────────

export async function getTags(): Promise<Tag[]> {
  if (USE_MOCK_API) return mockTags;
  const res = await apiFetch<{ data: Tag[] }>("/tags", { next: { revalidate: 3600 } });
  return res.data;
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  if (USE_MOCK_API) {
    const tag = mockTags.find((t) => t.slug === slug);
    if (!tag) throw new Error("Tag not found");
    return tag;
  }
  const res = await apiFetch<{ data: Tag }>(`/tags/${slug}`, { next: { revalidate: 3600 } });
  return res.data;
}

export async function getTagArticles(
  slug: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<ArticleCard>> {
  if (USE_MOCK_API) {
    return paginate(
      filterMockArticles({ tagSlug: slug }).map(toArticleCard),
      page,
      limit
    );
  }
  return apiFetch<PaginatedResponse<ArticleCard>>(
    `/tags/${slug}/articles?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

// ── Sitemap helpers ───────────────────────────────────────────────────

export async function getAllArticleSlugs(): Promise<{ categorySlug: string; articleSlug: string }[]> {
  if (USE_MOCK_API) {
    return mockArticles
      .filter((a) => a.status === ("published" as ArticleStatus))
      .map((a) => ({ categorySlug: a.category.slug, articleSlug: a.slug }));
  }
  return apiFetch("/articles/slugs", { cache: "no-store" });
}

export async function getAllCategorySlugs(): Promise<string[]> {
  if (USE_MOCK_API) return mockCategories.map((c) => c.slug);
  const res = await apiFetch<{ data: Category[] }>("/categories", { cache: "no-store" });
  return res.data.map((c) => c.slug);
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  if (USE_MOCK_API) return mockAuthors.map((a) => a.slug);
  const res = await apiFetch<{ data: Author[] }>("/authors", { cache: "no-store" });
  return res.data.map((a) => a.slug);
}

export async function getAllTagSlugs(): Promise<string[]> {
  if (USE_MOCK_API) return mockTags.map((t) => t.slug);
  const res = await apiFetch<{ data: Tag[] }>("/tags", { cache: "no-store" });
  return res.data.map((t) => t.slug);
}