const { tags, articles } = require('../data/mock');

// GET /api/tags
exports.getAll = (req, res) => {
  res.json({ data: tags });
};

// GET /api/tags/slugs
exports.getSlugs = (req, res) => {
  res.json(tags.map((t) => t.slug));
};

// GET /api/tags/:slug
exports.getBySlug = (req, res) => {
  const tag = tags.find((t) => t.slug === req.params.slug);

  if (!tag) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Tag not found' },
    });
  }

  res.json({ data: tag });
};

// GET /api/tags/:slug/articles
exports.getArticles = (req, res) => {
  const tag = tags.find((t) => t.slug === req.params.slug);

  if (!tag) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Tag not found' },
    });
  }

  const { page = 1, limit = 10 } = req.query;

  const filtered = articles.filter(
    (a) => a.tags.some((t) => t.slug === req.params.slug) && a.status === 'published'
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / Number(limit)));
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);
  const start = (currentPage - 1) * Number(limit);

  res.json({
    data: filtered.slice(start, start + Number(limit)),
    meta: { page: currentPage, limit: Number(limit), total, totalPages },
  });
};
