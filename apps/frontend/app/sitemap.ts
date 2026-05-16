// ============================================================
// app/sitemap.ts — Dynamic XML sitemap generation
// ============================================================

import type { MetadataRoute } from "next";
import {
  getAllArticleSlugs,
  getAllCategorySlugs,
  getAllAuthorSlugs,
  getAllTagSlugs,
  getArticles,
} from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleSlugs, categorySlugs, authorSlugs, tagSlugs] =
    await Promise.all([
      getAllArticleSlugs(),
      getAllCategorySlugs(),
      getAllAuthorSlugs(),
      getAllTagSlugs(),
    ]);

  // ── Static routes ─────────────────────────────────────────

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/search"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // ── Category pages ────────────────────────────────────────

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: absoluteUrl(`/categories/${slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // ── Article pages ─────────────────────────────────────────

  const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map(
    ({ categorySlug, articleSlug }) => ({
      url: absoluteUrl(`/categories/${categorySlug}/${articleSlug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })
  );

  // ── Author pages ──────────────────────────────────────────

  const authorRoutes: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: absoluteUrl(`/authors/${slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Tag pages ─────────────────────────────────────────────

  const tagRoutes: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
    url: absoluteUrl(`/tags/${slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...articleRoutes,
    ...authorRoutes,
    ...tagRoutes,
  ];
}
