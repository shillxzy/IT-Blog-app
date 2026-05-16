// ============================================================
// app/robots.ts — robots.txt generation
// ============================================================

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourblog.com";

  return {
    rules: [
      {
        // Main crawler rule — allow everything except /admin
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/_next/",
          "/search",       // optional: exclude dynamic search pages
        ],
      },
      {
        // Block all bots from admin completely
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

/*
 * Output (app/robots.ts generates /robots.txt):
 *
 * User-agent: *
 * Allow: /
 * Disallow: /admin
 * Disallow: /admin/
 * Disallow: /api/
 * Disallow: /_next/
 * Disallow: /search
 *
 * User-agent: GPTBot
 * Disallow: /
 *
 * Sitemap: https://yourblog.com/sitemap.xml
 * Host: https://yourblog.com
 */
