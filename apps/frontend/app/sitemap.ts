import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { getSitemapPriority } from "@/lib/semantic-core";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1.0, lastModified: new Date() },
    // Silo root — all categories listing
    { url: absoluteUrl("/categories"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/search"), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
    if (!API_BASE) return staticRoutes;

    const [articlesRes, categoriesRes, authorsRes, tagsRes] = await Promise.allSettled([
      fetch(`${API_BASE}/articles/slugs`, { cache: "no-store" }),
      fetch(`${API_BASE}/categories`, { cache: "no-store" }),
      fetch(`${API_BASE}/authors`, { cache: "no-store" }),
      fetch(`${API_BASE}/tags`, { cache: "no-store" }),
    ]);

    const articleSlugs: { categorySlug: string; articleSlug: string }[] =
      articlesRes.status === "fulfilled" && articlesRes.value.ok
        ? await articlesRes.value.json()
        : [];

    const categoriesData =
      categoriesRes.status === "fulfilled" && categoriesRes.value.ok
        ? await categoriesRes.value.json()
        : { data: [] };
    const categorySlugs: string[] = (categoriesData.data ?? []).map((c: { slug: string }) => c.slug);

    const authorsData =
      authorsRes.status === "fulfilled" && authorsRes.value.ok
        ? await authorsRes.value.json()
        : { data: [] };
    const authorSlugs: string[] = (authorsData.data ?? []).map((a: { slug: string }) => a.slug);

    const tagsData =
      tagsRes.status === "fulfilled" && tagsRes.value.ok
        ? await tagsRes.value.json()
        : { data: [] };
    const tagSlugs: string[] = (tagsData.data ?? []).map((t: { slug: string }) => t.slug);

    return [
      ...staticRoutes,
      // Category pages get priority from semantic core silo data
      ...categorySlugs.map((slug) => {
        const url = absoluteUrl(`/categories/${slug}`);
        return {
          url,
          changeFrequency: "weekly" as const,
          priority: getSitemapPriority(url),
        };
      }),
      // Articles get priority from semantic core silo data
      ...articleSlugs.map(({ categorySlug, articleSlug }) => {
        const url = absoluteUrl(`/categories/${categorySlug}/${articleSlug}`);
        return {
          url,
          changeFrequency: "monthly" as const,
          priority: getSitemapPriority(url),
        };
      }),
      ...authorSlugs.map((slug) => ({
        url: absoluteUrl(`/authors/${slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...tagSlugs.map((slug) => ({
        url: absoluteUrl(`/tags/${slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.4,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
