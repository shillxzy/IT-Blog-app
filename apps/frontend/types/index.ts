// ============================================================
// types/index.ts — Centralized TypeScript entity definitions
// ============================================================

export interface Author {
  id: string;
  slug: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  website?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  articlesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  cover?: string;
  color?: string; // hex color for UI accents
  articlesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  articlesCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown
  cover: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: ArticleStatus;
  viewsCount: number;
  readingTime: number; // minutes
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

// Lightweight version for lists / cards
export interface ArticleCard
  extends Pick<
    Article,
    | "id"
    | "slug"
    | "title"
    | "excerpt"
    | "cover"
    | "viewsCount"
    | "readingTime"
    | "publishedAt"
    | "status"
  > {
  author: Pick<Author, "id" | "slug" | "name" | "avatar">;
  category: Pick<Category, "id" | "slug" | "name" | "color">;
  tags: Pick<Tag, "id" | "slug" | "name">[];
}

// ── Pagination ──────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── API / fetch helpers ─────────────────────────────────────

export interface ArticleFilters {
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  search?: string;
  status?: ArticleStatus;
  page?: number;
  limit?: number;
}

// ── Admin forms ─────────────────────────────────────────────

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: File | string | null;
  categoryId: string;
  tagIds: string[];
  authorId: string;
  status: ArticleStatus;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  cover?: File | string | null;
  color?: string;
}

export interface TagFormData {
  name: string;
  slug: string;
}

export interface AuthorFormData {
  name: string;
  slug: string;
  email: string;
  bio: string;
  avatar: File | string | null;
  website?: string;
  social?: Author["social"];
}

// ── Auth ────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "editor";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}
