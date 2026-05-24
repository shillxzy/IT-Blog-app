// ============================================================
// lib/semantic-core.ts
// Semantic core for IT Blog (Sprint 3-1)
// Used by: sitemap priorities, structured data, SEO content
// ============================================================

export type SearchIntent = "informational" | "navigational" | "transactional" | "commercial";
export type Volume = "100-1000" | "1000-10000" | "10000-100000";
export type Competition = "Low" | "Medium" | "High";
export type Priority = 1 | 2 | 3;

export interface Keyword {
  keyword: string;
  intent: SearchIntent;
  volume: Volume;
  competition: Competition;
  cluster: string;
  targetPage: string;
  priority: Priority;
  notes?: string;
}

export interface Cluster {
  id: string;
  name: string;
  headKeyword: string;
  pageType: "category" | "article" | "static" | "listing";
  targetPage: string;
  priority: Priority;
  silo: string;
}

export interface SiloPage {
  url: string;
  name: string;
  type: "home" | "category" | "article" | "static" | "listing" | "dynamic" | "functional";
  headKeyword: string;
  description: string;
  linksTo?: string[];
  linkedFrom?: string[];
  silo?: string;
}

export interface InternalLink {
  from: string;
  to: string;
  linkType: "contextual" | "breadcrumb" | "related" | "navigation" | "footer";
  anchorText: string;
}

// ----------------------------------------------------------------
// 1. KEYWORDS — 45 queries across 4 intent types
// ----------------------------------------------------------------
export const keywords: Keyword[] = [
  // --- informational (≥14 queries) ---
  {
    keyword: "javascript для початківців",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "javascript-basics",
    targetPage: "/categories/frontend",
    priority: 1,
  },
  {
    keyword: "javascript async await пояснення",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "javascript-basics",
    targetPage: "/categories/frontend",
    priority: 1,
  },
  {
    keyword: "що таке closures в javascript",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "javascript-basics",
    targetPage: "/categories/frontend",
    priority: 2,
  },
  {
    keyword: "es6 нові можливості javascript",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "javascript-basics",
    targetPage: "/categories/frontend",
    priority: 2,
  },
  {
    keyword: "react hooks tutorial",
    intent: "informational",
    volume: "1000-10000",
    competition: "Medium",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 1,
  },
  {
    keyword: "як використовувати usestate в react",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 1,
  },
  {
    keyword: "useeffect react приклади",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 2,
  },
  {
    keyword: "react кастомні хуки створення",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 3,
  },
  {
    keyword: "typescript для початківців",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "typescript-patterns",
    targetPage: "/categories/frontend",
    priority: 1,
  },
  {
    keyword: "typescript generics пояснення",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "typescript-patterns",
    targetPage: "/categories/frontend",
    priority: 2,
  },
  {
    keyword: "node.js для початківців",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "nodejs-backend",
    targetPage: "/categories/backend",
    priority: 1,
  },
  {
    keyword: "rest api best practices",
    intent: "informational",
    volume: "1000-10000",
    competition: "Medium",
    cluster: "nodejs-backend",
    targetPage: "/categories/backend",
    priority: 2,
  },
  {
    keyword: "postgresql для початківців",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "databases-sql",
    targetPage: "/categories/backend",
    priority: 1,
  },
  {
    keyword: "sql join що таке і як використовувати",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "databases-sql",
    targetPage: "/categories/backend",
    priority: 1,
  },
  {
    keyword: "postgresql індекси оптимізація запитів",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "databases-sql",
    targetPage: "/categories/backend",
    priority: 3,
  },
  {
    keyword: "docker для розробників",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "docker-devops",
    targetPage: "/categories/devops",
    priority: 1,
  },
  {
    keyword: "docker compose tutorial",
    intent: "informational",
    volume: "1000-10000",
    competition: "Medium",
    cluster: "docker-devops",
    targetPage: "/categories/devops",
    priority: 1,
  },
  {
    keyword: "контейнеризація що таке",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "docker-devops",
    targetPage: "/categories/devops",
    priority: 2,
  },
  {
    keyword: "github actions ci cd tutorial",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "cicd-automation",
    targetPage: "/categories/devops",
    priority: 1,
  },
  {
    keyword: "ci cd для початківців",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "cicd-automation",
    targetPage: "/categories/devops",
    priority: 1,
  },
  {
    keyword: "llm api інтеграція у веб-додаток",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "llm-ai-apis",
    targetPage: "/categories/ai",
    priority: 1,
    notes: "зростаючий тренд 2024-2026",
  },
  {
    keyword: "rag архітектура що таке",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "llm-ai-apis",
    targetPage: "/categories/ai",
    priority: 1,
    notes: "зростаючий тренд",
  },
  {
    keyword: "векторна база даних для AI",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "llm-ai-apis",
    targetPage: "/categories/ai",
    priority: 2,
  },
  {
    keyword: "продуктивність розробника поради",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "dev-productivity",
    targetPage: "/categories/productivity",
    priority: 1,
  },
  {
    keyword: "кращі плагіни vs code 2025",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "dev-productivity",
    targetPage: "/categories/productivity",
    priority: 1,
    notes: "сезонний пік — початок року",
  },
  {
    keyword: "pomodoro техніка для програмістів",
    intent: "informational",
    volume: "100-1000",
    competition: "Low",
    cluster: "dev-productivity",
    targetPage: "/categories/productivity",
    priority: 3,
  },
  {
    keyword: "кар'єра програміста з нуля",
    intent: "informational",
    volume: "1000-10000",
    competition: "Low",
    cluster: "career-growth",
    targetPage: "/categories/productivity",
    priority: 1,
  },
  // --- navigational (≥4 queries) ---
  {
    keyword: "github login",
    intent: "navigational",
    volume: "10000-100000",
    competition: "High",
    cluster: "dev-tools-nav",
    targetPage: "/categories/devops",
    priority: 3,
  },
  {
    keyword: "node.js download",
    intent: "navigational",
    volume: "10000-100000",
    competition: "High",
    cluster: "nodejs-backend",
    targetPage: "/categories/backend",
    priority: 3,
    notes: "navigational — не таргетуємо, але релевантна сторінка",
  },
  {
    keyword: "mdn javascript documentation",
    intent: "navigational",
    volume: "10000-100000",
    competition: "High",
    cluster: "javascript-basics",
    targetPage: "/categories/frontend",
    priority: 3,
  },
  {
    keyword: "react офіційна документація",
    intent: "navigational",
    volume: "1000-10000",
    competition: "High",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 3,
  },
  // --- transactional (≥4 queries) ---
  {
    keyword: "завантажити vs code",
    intent: "transactional",
    volume: "10000-100000",
    competition: "Low",
    cluster: "dev-productivity",
    targetPage: "/categories/productivity",
    priority: 2,
    notes: "transactional — можна написати статтю-гайд зі встановлення",
  },
  {
    keyword: "завантажити docker desktop",
    intent: "transactional",
    volume: "1000-10000",
    competition: "Low",
    cluster: "docker-devops",
    targetPage: "/categories/devops",
    priority: 2,
  },
  {
    keyword: "встановити node.js windows",
    intent: "transactional",
    volume: "1000-10000",
    competition: "Low",
    cluster: "nodejs-backend",
    targetPage: "/categories/backend",
    priority: 2,
  },
  {
    keyword: "створити react застосунок",
    intent: "transactional",
    volume: "1000-10000",
    competition: "Low",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 2,
    notes: "People also ask: як почати react проект",
  },
  // --- commercial (≥4 queries) ---
  {
    keyword: "next.js vs nuxt порівняння 2025",
    intent: "commercial",
    volume: "1000-10000",
    competition: "Medium",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 2,
  },
  {
    keyword: "typescript vs javascript коли використовувати",
    intent: "commercial",
    volume: "100-1000",
    competition: "Medium",
    cluster: "typescript-patterns",
    targetPage: "/categories/frontend",
    priority: 2,
  },
  {
    keyword: "react context vs redux вибір",
    intent: "commercial",
    volume: "100-1000",
    competition: "Medium",
    cluster: "react-hooks",
    targetPage: "/categories/frontend",
    priority: 2,
  },
  {
    keyword: "postgresql vs mongodb порівняння",
    intent: "commercial",
    volume: "100-1000",
    competition: "Medium",
    cluster: "databases-sql",
    targetPage: "/categories/backend",
    priority: 2,
  },
  {
    keyword: "node.js vs python для backend",
    intent: "commercial",
    volume: "100-1000",
    competition: "Medium",
    cluster: "nodejs-backend",
    targetPage: "/categories/backend",
    priority: 2,
  },
  {
    keyword: "docker vs virtual machine різниця",
    intent: "commercial",
    volume: "100-1000",
    competition: "Medium",
    cluster: "docker-devops",
    targetPage: "/categories/devops",
    priority: 3,
  },
  {
    keyword: "kubernetes vs docker swarm",
    intent: "commercial",
    volume: "100-1000",
    competition: "High",
    cluster: "cicd-automation",
    targetPage: "/categories/devops",
    priority: 3,
  },
  {
    keyword: "junior developer зарплата україна 2025",
    intent: "commercial",
    volume: "1000-10000",
    competition: "Low",
    cluster: "career-growth",
    targetPage: "/categories/productivity",
    priority: 2,
    notes: "сезонний пік — Q1 та Q3",
  },
  {
    keyword: "openai api vs claude api порівняння",
    intent: "commercial",
    volume: "100-1000",
    competition: "Low",
    cluster: "llm-ai-apis",
    targetPage: "/categories/ai",
    priority: 2,
    notes: "зростаючий тренд",
  },
  {
    keyword: "express.js vs fastify який кращий",
    intent: "commercial",
    volume: "100-1000",
    competition: "Low",
    cluster: "nodejs-backend",
    targetPage: "/categories/backend",
    priority: 3,
  },
];

// ----------------------------------------------------------------
// 2. CLUSTERS — 10 clusters, min 6 required
// ----------------------------------------------------------------
export const clusters: Cluster[] = [
  {
    id: "javascript-basics",
    name: "JavaScript Основи",
    headKeyword: "javascript для початківців",
    pageType: "category",
    targetPage: "/categories/frontend",
    priority: 1,
    silo: "frontend",
  },
  {
    id: "react-hooks",
    name: "React та Hooks",
    headKeyword: "react hooks tutorial",
    pageType: "article",
    targetPage: "/categories/frontend",
    priority: 1,
    silo: "frontend",
  },
  {
    id: "typescript-patterns",
    name: "TypeScript Патерни",
    headKeyword: "typescript для початківців",
    pageType: "article",
    targetPage: "/categories/frontend",
    priority: 2,
    silo: "frontend",
  },
  {
    id: "nodejs-backend",
    name: "Node.js та Backend",
    headKeyword: "node.js для початківців",
    pageType: "category",
    targetPage: "/categories/backend",
    priority: 1,
    silo: "backend",
  },
  {
    id: "databases-sql",
    name: "Бази даних та SQL",
    headKeyword: "postgresql для початківців",
    pageType: "article",
    targetPage: "/categories/backend",
    priority: 1,
    silo: "backend",
  },
  {
    id: "docker-devops",
    name: "Docker та DevOps",
    headKeyword: "docker для розробників",
    pageType: "category",
    targetPage: "/categories/devops",
    priority: 1,
    silo: "devops",
  },
  {
    id: "cicd-automation",
    name: "CI/CD та Автоматизація",
    headKeyword: "github actions ci cd tutorial",
    pageType: "article",
    targetPage: "/categories/devops",
    priority: 2,
    silo: "devops",
  },
  {
    id: "llm-ai-apis",
    name: "LLM та AI APIs",
    headKeyword: "llm api інтеграція у веб-додаток",
    pageType: "category",
    targetPage: "/categories/ai",
    priority: 1,
    silo: "ai",
  },
  {
    id: "dev-productivity",
    name: "Продуктивність Розробника",
    headKeyword: "продуктивність розробника поради",
    pageType: "article",
    targetPage: "/categories/productivity",
    priority: 1,
    silo: "productivity",
  },
  {
    id: "career-growth",
    name: "Кар'єра та Розвиток",
    headKeyword: "кар'єра програміста з нуля",
    pageType: "article",
    targetPage: "/categories/productivity",
    priority: 2,
    silo: "productivity",
  },
];

// ----------------------------------------------------------------
// 3. SILO STRUCTURE
// ----------------------------------------------------------------

/** Level 0 — Home */
export const homePageSilo: SiloPage = {
  url: "/",
  name: "Головна",
  type: "home",
  headKeyword: "it блог для розробників україна",
  description: "Останні статті всіх категорій, навігація по силосах",
  linksTo: [
    "/categories/frontend",
    "/categories/backend",
    "/categories/devops",
    "/categories/ai",
    "/categories/productivity",
    "/about",
  ],
};

/** Level 1 — Category pages (silos) */
export const categoryPagesSilo: SiloPage[] = [
  {
    url: "/categories/frontend",
    name: "Frontend",
    type: "category",
    headKeyword: "javascript tutorial",
    description: "React, Next.js, TypeScript і сучасний веб. Силос: Frontend.",
    silo: "frontend",
    linksTo: ["/categories/backend", "/categories/devops"],
    linkedFrom: ["/"],
  },
  {
    url: "/categories/backend",
    name: "Backend",
    type: "category",
    headKeyword: "node.js для початківців",
    description: "Node.js, REST API, Express та бази даних. Силос: Backend.",
    silo: "backend",
    linksTo: ["/categories/devops", "/categories/frontend"],
    linkedFrom: ["/"],
  },
  {
    url: "/categories/devops",
    name: "DevOps",
    type: "category",
    headKeyword: "devops для початківців",
    description: "Docker, CI/CD, GitHub Actions та deployment. Силос: DevOps.",
    silo: "devops",
    linksTo: ["/categories/backend"],
    linkedFrom: ["/"],
  },
  {
    url: "/categories/ai",
    name: "AI & ML",
    type: "category",
    headKeyword: "llm api інтеграція",
    description: "LLM APIs, RAG, векторні бази даних та AI для розробників. Силос: AI.",
    silo: "ai",
    linksTo: ["/categories/backend"],
    linkedFrom: ["/"],
  },
  {
    url: "/categories/productivity",
    name: "Productivity",
    type: "category",
    headKeyword: "продуктивність програміста",
    description: "Інструменти, практики та кар'єра розробника. Силос: Productivity.",
    silo: "productivity",
    linksTo: ["/categories/frontend"],
    linkedFrom: ["/"],
  },
];

/** Level 2 — Articles (within their silo) */
export const articlePagesSilo: SiloPage[] = [
  {
    url: "/categories/frontend/react-hooks-guide",
    name: "Повний гайд по React Hooks",
    type: "article",
    headKeyword: "react hooks tutorial",
    description: "useState, useEffect, useRef, useCallback — повне пояснення",
    silo: "frontend",
    linksTo: ["/categories/frontend/react-state-management", "/categories/frontend"],
    linkedFrom: ["/categories/frontend", "/categories/frontend/typescript-react"],
  },
  {
    url: "/categories/frontend/typescript-for-beginners",
    name: "TypeScript для початківців",
    type: "article",
    headKeyword: "typescript для початківців",
    description: "Базові типи, інтерфейси, generics — стартова точка",
    silo: "frontend",
    linksTo: ["/categories/frontend/react-hooks-guide", "/categories/frontend"],
    linkedFrom: ["/categories/frontend"],
  },
  {
    url: "/categories/backend/nodejs-rest-api",
    name: "REST API з Node.js та Express",
    type: "article",
    headKeyword: "node.js rest api",
    description: "Побудова REST API з нуля: маршрути, middleware, валідація",
    silo: "backend",
    linksTo: ["/categories/backend/postgresql-guide", "/categories/backend"],
    linkedFrom: ["/categories/backend"],
  },
  {
    url: "/categories/backend/postgresql-indexing",
    name: "Гайд по індексах PostgreSQL",
    type: "article",
    headKeyword: "postgresql індекси оптимізація",
    description: "B-tree, GIN, BRIN — коли і як використовувати індекси",
    silo: "backend",
    linksTo: ["/categories/backend/nodejs-rest-api", "/categories/backend"],
    linkedFrom: ["/categories/backend"],
  },
  {
    url: "/categories/devops/docker-for-developers",
    name: "Docker для розробників",
    type: "article",
    headKeyword: "docker для розробників",
    description: "Dockerfile, docker-compose, мережі та volumes",
    silo: "devops",
    linksTo: ["/categories/devops/github-actions-cicd", "/categories/devops"],
    linkedFrom: ["/categories/devops"],
  },
  {
    url: "/categories/devops/github-actions-cicd",
    name: "CI/CD з GitHub Actions",
    type: "article",
    headKeyword: "github actions ci cd tutorial",
    description: "Automated testing, deployment pipelines та secrets management",
    silo: "devops",
    linksTo: ["/categories/devops/docker-for-developers", "/categories/devops"],
    linkedFrom: ["/categories/devops", "/categories/devops/docker-for-developers"],
  },
  {
    url: "/categories/ai/llm-api-integration",
    name: "Інтеграція LLM API у веб-додаток",
    type: "article",
    headKeyword: "llm api інтеграція у веб-додаток",
    description: "OpenAI, Anthropic Claude, streaming responses та обробка помилок",
    silo: "ai",
    linksTo: ["/categories/ai/rag-architecture", "/categories/ai"],
    linkedFrom: ["/categories/ai"],
  },
  {
    url: "/categories/ai/rag-architecture",
    name: "RAG Архітектура від А до Я",
    type: "article",
    headKeyword: "rag архітектура що таке",
    description: "Retrieval-Augmented Generation: embeddings, vector DB, retrieval chain",
    silo: "ai",
    linksTo: ["/categories/backend/postgresql-indexing", "/categories/ai"],
    linkedFrom: ["/categories/ai", "/categories/ai/llm-api-integration"],
  },
];

/** Level 3 — Static/functional pages */
export const staticPagesSilo: SiloPage[] = [
  { url: "/about", name: "Про нас", type: "static", headKeyword: "it блог команда", description: "" },
  { url: "/authors", name: "Автори", type: "listing", headKeyword: "автори it блог", description: "" },
  { url: "/tags/[slug]", name: "Теги", type: "dynamic", headKeyword: "", description: "" },
  { url: "/search", name: "Пошук", type: "functional", headKeyword: "", description: "" },
];

// ----------------------------------------------------------------
// 4. INTERNAL LINKS — 12 links (min 10 required)
// ----------------------------------------------------------------
export const internalLinks: InternalLink[] = [
  // Navigational — breadcrumbs
  {
    from: "/categories/frontend/react-hooks-guide",
    to: "/categories/frontend",
    linkType: "breadcrumb",
    anchorText: "Frontend",
  },
  {
    from: "/categories/backend/nodejs-rest-api",
    to: "/categories/backend",
    linkType: "breadcrumb",
    anchorText: "Backend",
  },
  {
    from: "/categories/devops/docker-for-developers",
    to: "/categories/devops",
    linkType: "breadcrumb",
    anchorText: "DevOps",
  },
  // Contextual — within silo
  {
    from: "/categories/frontend",
    to: "/categories/frontend/react-hooks-guide",
    linkType: "contextual",
    anchorText: "Читати гайд по React Hooks",
  },
  {
    from: "/categories/frontend/react-hooks-guide",
    to: "/categories/frontend/typescript-for-beginners",
    linkType: "related",
    anchorText: "Також читайте: TypeScript для початківців",
  },
  {
    from: "/categories/backend",
    to: "/categories/backend/postgresql-indexing",
    linkType: "contextual",
    anchorText: "Оптимізація PostgreSQL — гайд по індексах",
  },
  {
    from: "/categories/backend/nodejs-rest-api",
    to: "/categories/backend/postgresql-indexing",
    linkType: "related",
    anchorText: "Про оптимізацію бази даних",
  },
  {
    from: "/categories/devops/docker-for-developers",
    to: "/categories/devops/github-actions-cicd",
    linkType: "related",
    anchorText: "CI/CD з GitHub Actions",
  },
  {
    from: "/categories/ai/llm-api-integration",
    to: "/categories/ai/rag-architecture",
    linkType: "related",
    anchorText: "RAG архітектура — наступний крок",
  },
  // Cross-silo (justified — technical connection)
  {
    from: "/categories/ai/rag-architecture",
    to: "/categories/backend/postgresql-indexing",
    linkType: "contextual",
    anchorText: "Векторні індекси в PostgreSQL",
  },
  // Navigation links (global nav)
  {
    from: "/",
    to: "/categories/frontend",
    linkType: "navigation",
    anchorText: "Frontend",
  },
  {
    from: "/",
    to: "/categories/backend",
    linkType: "navigation",
    anchorText: "Backend",
  },
];

// ----------------------------------------------------------------
// 5. SILO PRIORITY BOOST — used in sitemap.ts
// Tier 1 clusters get sitemap priority 0.9, tier 2 → 0.7, tier 3 → 0.5
// ----------------------------------------------------------------
export function getSitemapPriority(url: string): number {
  const tier1Patterns = [
    "/categories/frontend",
    "/categories/backend",
    "/categories/devops",
    "/categories/ai",
    "/categories/productivity",
  ];
  const isCategory = tier1Patterns.some((p) => url.endsWith(p));
  if (isCategory) return 0.85;

  // Articles are high priority
  const isArticle = tier1Patterns.some((p) => url.includes(p + "/"));
  if (isArticle) return 0.9;

  return 0.5;
}
