import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Author } from "@/types";
import { formatDate } from "@/lib/utils";

interface AuthorBlockProps {
  author: Author;
  publishedAt: string | null;
  updatedAt: string;
}

export function AuthorBlock({ author, publishedAt, updatedAt }: AuthorBlockProps) {
  return (
    <div className="author-block">
      <div className="author-avatar">
        {author.avatar ? (
          <Image src={author.avatar} alt={author.name} fill sizes="64px" />
        ) : (
          <div className="author-avatar-fallback">
            {author.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="author-info">
        <Link href={`/authors/${author.slug}`} className="author-name">
          {author.name}
        </Link>
        <p className="author-bio">
          {author.bio || "Автор IT-Blog, експерт у своїй галузі."}
        </p>
      </div>
      <div className="author-meta">
        {publishedAt && (
          <time dateTime={publishedAt} className="meta-item">
            <Clock size={14} /> Опубліковано: {formatDate(publishedAt)}
          </time>
        )}
        {updatedAt && updatedAt !== publishedAt && (
          <time dateTime={updatedAt} className="meta-item">
            <Clock size={14} /> Оновлено: {formatDate(updatedAt)}
          </time>
        )}
      </div>
    </div>
  );
}
