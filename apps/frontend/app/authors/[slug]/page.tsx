// ============================================================
// app/authors/[slug]/page.tsx — Author profile page (ISR)
// ============================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getAuthorBySlug, getArticles, getAllAuthorSlugs } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";
import { Twitter, Linkedin, Github, Globe } from "lucide-react";

export const revalidate = 3600;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  let author;
  try {
    author = await getAuthorBySlug(slug);
  } catch {
    return { title: "Автор не знайдений" };
  }

  return {
    title: `${author.name} — YourBlog`,
    description: author.bio,
    alternates: { canonical: absoluteUrl(`/authors/${slug}`) },
    openGraph: {
      title: author.name,
      description: author.bio,
      type: "profile",
      images: [{ url: author.avatar, width: 400, height: 400, alt: author.name }],
    },
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr ?? "1");

  let author;
  try {
    author = await getAuthorBySlug(slug);
  } catch {
    notFound();
  }

  const { data: articles, meta } = await getArticles({
    authorSlug: slug,
    page,
    limit: 12,
    status: "published",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Author header */}
      <header className="flex flex-col sm:flex-row items-start gap-8 mb-12 pb-12 border-b border-stone-200">
        <Image
          src={author.avatar}
          alt={author.name}
          width={128}
          height={128}
          className="rounded-full object-cover flex-shrink-0 ring-4 ring-stone-100"
        />

        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-600 uppercase tracking-widest mb-1">
            Автор
          </p>
          <h1 className="font-display text-4xl font-bold text-stone-900 mb-3">
            {author.name}
          </h1>
          <p className="text-stone-500 leading-relaxed max-w-2xl mb-4">{author.bio}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400 mb-4">
            <span>{author.articlesCount} статей</span>
            {author.email && (
              <a
                href={`mailto:${author.email}`}
                className="hover:text-stone-700 transition-colors"
              >
                {author.email}
              </a>
            )}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
              >
                <Globe size={15} /> Сайт
              </a>
            )}
            {author.social?.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-700 transition-colors"
              >
                <Twitter size={18} />
              </a>
            )}
            {author.social?.linkedin && (
              <a
                href={`https://linkedin.com/in/${author.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-700 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            {author.social?.github && (
              <a
                href={`https://github.com/${author.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-700 transition-colors"
              >
                <Github size={18} />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Articles */}
      <section>
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">
          Статті автора
        </h2>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p>Автор ще не опублікував жодної статті</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCardComponent key={article.id} article={article} />
              ))}
            </div>
            <Suspense>
              <Pagination meta={meta} />
            </Suspense>
          </>
        )}
      </section>
    </div>
  );
}
