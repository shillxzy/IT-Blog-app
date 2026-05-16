"use client";
// ============================================================
// components/admin/ArticleForm.tsx — Client Component
// Full CRUD form for article creation and editing
// ============================================================

import { useState, useRef, useCallback } from "react";
import type { Article, ArticleFormData, Category, Tag, Author } from "@/types";
import { slugify } from "@/lib/utils";
import {
  Upload,
  X,
  Eye,
  Save,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

interface ArticleFormProps {
  // Pass existing article for edit mode
  article?: Article;
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  onSubmit: (data: FormData) => Promise<void>;
}

export function ArticleForm({
  article,
  categories,
  tags,
  authors,
  onSubmit,
}: ArticleFormProps) {
  const isEdit = !!article;

  // ── Form state ──────────────────────────────────────────────
  const [form, setForm] = useState<Omit<ArticleFormData, "cover">>({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    categoryId: article?.category.id ?? "",
    tagIds: article?.tags.map((t) => t.id) ?? [],
    authorId: article?.author.id ?? "",
    status: article?.status ?? "draft",
    metaTitle: article?.metaTitle ?? "",
    metaDescription: article?.metaDescription ?? "",
    publishedAt: article?.publishedAt ?? "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(
    article?.cover ?? ""
  );
  const [isSlugManual, setIsSlugManual] = useState(isEdit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ────────────────────────────────────────────────

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      // Auto-generate slug while the user hasn't manually edited it
      ...(isSlugManual ? {} : { slug: slugify(value) }),
    }));
  };

  const handleSlugChange = (value: string) => {
    setIsSlugManual(true);
    setForm((prev) => ({ ...prev, slug: slugify(value) }));
  };

  const handleCoverChange = (file: File) => {
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleCoverDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleCoverChange(file);
      }
    },
    []
  );

  const handleTagToggle = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    status?: ArticleFormData["status"]
  ) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const fd = new FormData();
      const finalStatus = status ?? form.status;

      Object.entries({ ...form, status: finalStatus }).forEach(
        ([key, val]) => {
          if (Array.isArray(val)) {
            val.forEach((v) => fd.append(key, v));
          } else if (val !== null && val !== undefined) {
            fd.append(key, String(val));
          }
        }
      );

      if (coverFile) {
        fd.append("cover", coverFile, coverFile.name);
      } else if (article?.cover) {
        fd.append("coverUrl", article.cover);
      }

      await onSubmit(fd);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column: main content ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="label">Заголовок *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Введіть заголовок статті..."
              className="input text-lg font-medium"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="label">URL-slug *</label>
            <div className="flex items-center">
              <span className="text-xs text-neutral-400 bg-neutral-100 border border-r-0 border-neutral-300 rounded-l-lg px-3 py-2.5 whitespace-nowrap">
                /categories/.../
              </span>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="input rounded-l-none flex-1"
              />
            </div>
          </div>

          {/* Tabs: Content / SEO */}
          <div>
            <div className="flex border-b border-neutral-200 mb-4">
              {(["content", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {tab === "content" ? "Контент" : "SEO"}
                </button>
              ))}
            </div>

            {activeTab === "content" && (
              <div className="space-y-4">
                {/* Excerpt */}
                <div>
                  <label className="label">Анонс *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.excerpt}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, excerpt: e.target.value }))
                    }
                    placeholder="Короткий опис статті (160–200 символів)..."
                    className="input resize-none"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    {form.excerpt.length}/200 символів
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="label">Контент (HTML) *</label>
                  <textarea
                    required
                    rows={20}
                    value={form.content}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, content: e.target.value }))
                    }
                    placeholder="<p>Текст статті...</p>"
                    className="input resize-y font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-4">
                <div>
                  <label className="label">SEO заголовок</label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, metaTitle: e.target.value }))
                    }
                    placeholder="Залиште порожнім, щоб використати заголовок статті"
                    className="input"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    {form.metaTitle?.length ?? 0}/60
                  </p>
                </div>

                <div>
                  <label className="label">SEO опис</label>
                  <textarea
                    rows={3}
                    value={form.metaDescription}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        metaDescription: e.target.value,
                      }))
                    }
                    placeholder="Залиште порожнім, щоб використати анонс"
                    className="input resize-none"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    {form.metaDescription?.length ?? 0}/160
                  </p>
                </div>

                {/* SERP preview */}
                <div className="rounded-lg border border-neutral-200 p-4 bg-white">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                    Прев'ю в пошуку
                  </p>
                  <p className="text-blue-700 text-base font-medium leading-tight">
                    {form.metaTitle || form.title || "Заголовок статті"}
                  </p>
                  <p className="text-green-700 text-xs mt-0.5">
                    yourblog.com › categories › ...
                  </p>
                  <p className="text-neutral-600 text-sm mt-1 line-clamp-2">
                    {form.metaDescription ||
                      form.excerpt ||
                      "Опис статті з'явиться тут"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: metadata ── */}
        <div className="space-y-5">
          {/* Cover image upload */}
          <div>
            <label className="label">Обкладинка</label>
            <div
              onDrop={handleCoverDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-neutral-300 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors aspect-video bg-neutral-50 flex items-center justify-center"
            >
              {coverPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverFile(null);
                      setCoverPreview("");
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400 p-4">
                  <ImageIcon size={32} strokeWidth={1} />
                  <p className="text-xs text-center">
                    Перетягніть зображення або натисніть
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverChange(file);
              }}
            />
          </div>

          {/* Author */}
          <div>
            <label className="label">Автор *</label>
            <select
              required
              value={form.authorId}
              onChange={(e) =>
                setForm((p) => ({ ...p, authorId: e.target.value }))
              }
              className="input"
            >
              <option value="">Оберіть автора</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="label">Категорія *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) =>
                setForm((p) => ({ ...p, categoryId: e.target.value }))
              }
              className="input"
            >
              <option value="">Оберіть категорію</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Теги</label>
            <div className="flex flex-wrap gap-2 p-3 border border-neutral-300 rounded-lg bg-white min-h-[80px]">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    form.tagIds.includes(tag.id)
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Publish date */}
          <div>
            <label className="label">Дата публікації</label>
            <input
              type="datetime-local"
              value={form.publishedAt ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, publishedAt: e.target.value }))
              }
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isEdit ? "Зберегти зміни" : "Зберегти як чернетку"}
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent, "published")}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <Eye size={16} />
          Опублікувати
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => window.history.back()}
          className="ml-auto px-4 py-2.5 text-neutral-600 hover:text-neutral-800 transition-colors text-sm"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}
