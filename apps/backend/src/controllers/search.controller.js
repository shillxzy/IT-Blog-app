const { articles } = require('../data/mock');

// GET /api/search?q=...
exports.search = (req, res) => {
  const { q = '', page = 1, limit = 10 } = req.query;

  const search = q.trim().toLowerCase();

  if (!search) {
    return res.json({
      data: [],
      meta: { page: 1, limit: Number(limit), total: 0, totalPages: 0 },
    });
  }

  const filtered = articles.filter(
    (a) =>
      a.status === 'published' &&
      (a.title.toLowerCase().includes(search) ||
        a.excerpt.toLowerCase().includes(search) ||
        a.content.toLowerCase().includes(search))
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / Number(limit)));
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);
  const start = (currentPage - 1) * Number(limit);

  const data = filtered.slice(start, start + Number(limit)).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    cover: a.cover,
    publishedAt: a.publishedAt,
    category: { id: a.category.id, slug: a.category.slug, name: a.category.name, color: a.category.color },
    author: { id: a.author.id, slug: a.author.slug, name: a.author.name, avatar: a.author.avatar },
  }));

  res.json({
    data,
    meta: { page: currentPage, limit: Number(limit), total, totalPages },
  });
};
