// ============================================================
// components/blog/AuthorCard.tsx — Server Component
// ============================================================

import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/types";
import { Twitter, Linkedin, Github, Globe } from "lucide-react";

interface AuthorCardProps {
  author: Pick<
    Author,
    "id" | "slug" | "name" | "avatar" | "bio" | "website" | "social"
  >;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
      <div className="flex items-center gap-4 mb-3">
        <Image
          src={author.avatar}
          alt={author.name}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div>
          <Link
            href={`/authors/${author.slug}`}
            className="font-semibold text-stone-900 hover:text-amber-700 transition-colors"
          >
            {author.name}
          </Link>
          <p className="text-xs text-stone-500 mt-0.5">Автор</p>
        </div>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed mb-4">{author.bio}</p>

      {/* Social links */}
      <div className="flex items-center gap-3">
        {author.website && (
          <a
            href={author.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Вебсайт"
          >
            <Globe size={16} />
          </a>
        )}
        {author.social?.twitter && (
          <a
            href={`https://twitter.com/${author.social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={16} />
          </a>
        )}
        {author.social?.linkedin && (
          <a
            href={`https://linkedin.com/in/${author.social.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
        )}
        {author.social?.github && (
          <a
            href={`https://github.com/${author.social.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
