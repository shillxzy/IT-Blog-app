const { categories } = require('../data/mock');
const { articles } = require('../data/mock');

// GET /api/categories
exports.getAll = (req, res) => {
  res.json({ data: categories });
};

// GET /api/categories/slugs
exports.getSlugs = (req, res) => {
  res.json(categories.map((c) => c.slug));
};

// GET /api/categories/:slug
exports.getBySlug = (req, res) => {
  const category = categories.find((c) => c.slug === req.params.slug);

  if (!category) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Category not found' },
    });
  }

  res.json({ data: category });
};

// GET /api/categories/:slug/articles
exports.getArticles = (req, res) => {
  const category = categories.find((c) => c.slug === req.params.slug);

  if (!category) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Category not found' },
    });
  }

  const { page = 1, limit = 10 } = req.query;

  const filtered = articles.filter(
    (a) => a.category.slug === req.params.slug && a.status === 'published'
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
