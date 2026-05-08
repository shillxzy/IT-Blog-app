const { authors, articles } = require('../data/mock');

// GET /api/authors
exports.getAll = (req, res) => {
  res.json({ data: authors });
};

// GET /api/authors/slugs
exports.getSlugs = (req, res) => {
  res.json(authors.map((a) => a.slug));
};

// GET /api/authors/:slug
exports.getBySlug = (req, res) => {
  const author = authors.find((a) => a.slug === req.params.slug);

  if (!author) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Author not found' },
    });
  }

  res.json({ data: author });
};

// GET /api/authors/:slug/articles
exports.getArticles = (req, res) => {
  const author = authors.find((a) => a.slug === req.params.slug);

  if (!author) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Author not found' },
    });
  }

  const { page = 1, limit = 10 } = req.query;

  const filtered = articles.filter(
    (a) => a.author.slug === req.params.slug && a.status === 'published'
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
