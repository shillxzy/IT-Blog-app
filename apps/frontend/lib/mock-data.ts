import type { Article, ArticleCard, Author, Category, Tag } from "@/types";

export const mockAuthors: Author[] = [
  {
    id: "a1",
    slug: "oleh-koval",
    name: "Олег Коваль",
    email: "oleh@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Frontend-розробник та автор матеріалів про React і UX.",
    website: "https://example.com",
    social: { github: "octocat", linkedin: "octocat" },
    articlesCount: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "a2",
    slug: "iryna-bondar",
    name: "Ірина Бондар",
    email: "iryna@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    bio: "Пише про продуктивність, дизайн-системи та командні процеси.",
    articlesCount: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

export const mockCategories: Category[] = [
  {
    id: "c1",
    slug: "frontend",
    name: "Frontend",
    description: "React, Next.js, TypeScript і сучасний веб.",
    color: "#0ea5e9",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
    articlesCount: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "c2",
    slug: "productivity",
    name: "Productivity",
    description: "Практики для ефективної роботи і фокусу.",
    color: "#f59e0b",
    cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    articlesCount: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

export const mockTags: Tag[] = [
  { id: "t1", slug: "nextjs", name: "Next.js", articlesCount: 1, createdAt: "", updatedAt: "" },
  { id: "t2", slug: "react", name: "React", articlesCount: 1, createdAt: "", updatedAt: "" },
  { id: "t3", slug: "workflow", name: "Workflow", articlesCount: 2, createdAt: "", updatedAt: "" }
];

export const mockArticles: Article[] = [
  {
    id: "p1",
    slug: "start-with-nextjs-16",
    title: "Старт із Next.js 16: що змінилося",
    excerpt: "Короткий огляд нових можливостей Next.js 16 та поради для старту.",
    content: "<p>Демо-стаття для перегляду шаблонів сторінок без бекенду.</p>",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    author: mockAuthors[0],
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1]],
    status: "published",
    viewsCount: 1280,
    readingTime: 6,
    publishedAt: "2026-05-01T09:00:00.000Z",
    createdAt: "2026-05-01T09:00:00.000Z",
    updatedAt: "2026-05-01T09:00:00.000Z",
    metaTitle: "Старт із Next.js 16",
    metaDescription: "Огляд новинок Next.js 16"
  },
  {
    id: "p2",
    slug: "clean-component-architecture",
    title: "Чиста архітектура компонентів у React",
    excerpt: "Як розділяти UI-компоненти, фічі та бізнес-логіку.",
    content: "<p>Ще одна демо-стаття для макету каталогу.</p>",
    cover: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=80",
    author: mockAuthors[0],
    category: mockCategories[0],
    tags: [mockTags[1], mockTags[2]],
    status: "published",
    viewsCount: 824,
    readingTime: 8,
    publishedAt: "2026-05-02T09:00:00.000Z",
    createdAt: "2026-05-02T09:00:00.000Z",
    updatedAt: "2026-05-02T09:00:00.000Z"
  },
  {
    id: "p3",
    slug: "focus-methods-for-devs",
    title: "Методи фокусу для розробників",
    excerpt: "Практичний набір технік, щоб менше відволікатись.",
    content: "<p>Демо-матеріал у категорії продуктивності.</p>",
    cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
    author: mockAuthors[1],
    category: mockCategories[1],
    tags: [mockTags[2]],
    status: "published",
    viewsCount: 674,
    readingTime: 5,
    publishedAt: "2026-05-03T09:00:00.000Z",
    createdAt: "2026-05-03T09:00:00.000Z",
    updatedAt: "2026-05-03T09:00:00.000Z"
  },
  {
    id: "p4",
    slug: "weekly-planning-template",
    title: "Шаблон тижневого планування",
    excerpt: "Проста структура планування для команд і соло-розробників.",
    content: "<p>Чернетка для демо адмінки.</p>",
    cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80",
    author: mockAuthors[1],
    category: mockCategories[1],
    tags: [mockTags[2]],
    status: "draft",
    viewsCount: 141,
    readingTime: 4,
    publishedAt: null,
    createdAt: "2026-05-04T09:00:00.000Z",
    updatedAt: "2026-05-04T09:00:00.000Z"
  }
];

export function toArticleCard(article: Article): ArticleCard {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    cover: article.cover,
    viewsCount: article.viewsCount,
    readingTime: article.readingTime,
    publishedAt: article.publishedAt,
    status: article.status,
    author: {
      id: article.author.id,
      slug: article.author.slug,
      name: article.author.name,
      avatar: article.author.avatar
    },
    category: {
      id: article.category.id,
      slug: article.category.slug,
      name: article.category.name,
      color: article.category.color
    },
    tags: article.tags.map((tag) => ({ id: tag.id, slug: tag.slug, name: tag.name }))
  };
}
