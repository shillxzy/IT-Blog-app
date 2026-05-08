const { articles } = require('../data/mock');

// Helper: map article to card (lightweight)
function toCard(article) {
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
      avatar: article.author.avatar,
    },
    category: {
      id: article.category.id,
      slug: article.category.slug,
      name: article.category.name,
      color: article.category.color,
    },
    tags: article.tags.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
  };
}

function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: {
      page: currentPage,
      limit,
      total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
}

// GET /api/articles
exports.getAll = (req, res) => {
  const { category, tag, author, status, q, page = 1, limit = 10 } = req.query;

  let filtered = articles.filter((a) => {
    if (category && a.category.slug !== category) return false;
    if (tag && !a.tags.some((t) => t.slug === tag)) return false;
    if (author && a.author.slug !== author) return false;
    if (status) {
      if (a.status !== status) return false;
    } else {
      if (a.status !== 'published') return false; // default: only published
    }
    if (q) {
      const search = q.toLowerCase();
      if (
        !a.title.toLowerCase().includes(search) &&
        !a.excerpt.toLowerCase().includes(search)
      )
        return false;
    }
    return true;
  });

  const result = paginate(filtered.map(toCard), Number(page), Number(limit));
  res.json(result);
};

// GET /api/articles/slugs
exports.getSlugs = (req, res) => {
  const slugs = articles
    .filter((a) => a.status === 'published')
    .map((a) => ({ categorySlug: a.category.slug, articleSlug: a.slug }));
  res.json(slugs);
};

// GET /api/articles/:slug
exports.getBySlug = (req, res) => {
  const article = articles.find(
    (a) => a.slug === req.params.slug || a.id === req.params.slug
  );

  if (!article) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Article not found' },
    });
  }

  res.json({ data: article });
};

// GET /api/articles/:slug/related
exports.getRelated = (req, res) => {
  const article = articles.find((a) => a.slug === req.params.slug);

  if (!article) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Article not found' },
    });
  }

  const related = articles
    .filter(
      (a) =>
        a.id !== article.id &&
        a.category.id === article.category.id &&
        a.status === 'published'
    )
    .slice(0, 3)
    .map(toCard);

  res.json({ data: related });
};

// POST /api/articles/:id/view
exports.incrementView = (req, res) => {
  const article = articles.find(
    (a) => a.id === req.params.id || a.slug === req.params.id
  );

  if (!article) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Article not found' },
    });
  }

  article.viewsCount += 1;
  res.json({ data: { viewsCount: article.viewsCount } });
};
