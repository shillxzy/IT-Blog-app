const pool = require('../db/pool');

function fmt(row) {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description,
    color: row.color,
    cover: row.cover_url,
    articlesCount: Number(row.articles_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, COUNT(a.id) AS articles_count
       FROM categories c
       LEFT JOIN articles a ON a.category_id = c.id AND a.status = 'published'
       GROUP BY c.id ORDER BY c.name`
    );
    res.json({ data: rows.map(fmt) });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getSlugs = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT slug FROM categories');
    res.json(rows.map((r) => r.slug));
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, COUNT(a.id) AS articles_count
       FROM categories c
       LEFT JOIN articles a ON a.category_id = c.id AND a.status = 'published'
       WHERE c.slug = $1 GROUP BY c.id`,
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
    }
    res.json({ data: fmt(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const { rows: catRows } = await pool.query(
      'SELECT id FROM categories WHERE slug = $1',
      [req.params.slug]
    );
    if (!catRows.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
    }
    const categoryId = catRows[0].id;

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM articles WHERE category_id = $1 AND status = 'published'`,
      [categoryId]
    );
    const total = parseInt(countRows[0].count);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const { rows } = await pool.query(
      `SELECT a.id, a.slug, a.title, a.excerpt, a.cover_url, a.status,
              a.views, a.reading_time, a.published_at,
              u.id AS author_id, u.slug AS author_slug, u.name AS author_name,
              u.avatar_url AS author_avatar,
              c.id AS category_id, c.slug AS category_slug, c.name AS category_name,
              c.color AS category_color
       FROM articles a
       JOIN users u ON u.id = a.author_id
       JOIN categories c ON c.id = a.category_id
       WHERE a.category_id = $1 AND a.status = 'published'
       ORDER BY a.published_at DESC
       LIMIT $2 OFFSET $3`,
      [categoryId, limit, offset]
    );

    const data = rows.map((row) => ({
      id: String(row.id),
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      cover: row.cover_url,
      status: row.status,
      viewsCount: row.views,
      readingTime: row.reading_time,
      publishedAt: row.published_at,
      author: {
        id: String(row.author_id),
        slug: row.author_slug,
        name: row.author_name,
        avatar: row.author_avatar,
      },
      category: {
        id: String(row.category_id),
        slug: row.category_slug,
        name: row.category_name,
        color: row.category_color,
      },
      tags: [],
    }));

    res.json({
      data,
      meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};