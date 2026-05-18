const pool = require('../db/pool');

exports.search = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10 } = req.query;
    const search = q.trim();

    if (!search) {
      return res.json({
        data: [],
        meta: { page: 1, limit: Number(limit), total: 0, totalPages: 0 },
      });
    }

    const offset = (Number(page) - 1) * Number(limit);
    const pattern = `%${search}%`;

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM articles a
       WHERE a.status = 'published'
         AND (a.title ILIKE $1 OR a.excerpt ILIKE $1 OR a.content ILIKE $1)`,
      [pattern]
    );
    const total = parseInt(countRows[0].count);
    const totalPages = Math.max(1, Math.ceil(total / Number(limit)));

    const { rows } = await pool.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_url, a.published_at, a.views, a.reading_time,
              u.id AS author_id, u.slug AS author_slug, u.name AS author_name, u.avatar_url AS author_avatar,
              c.id AS category_id, c.slug AS category_slug, c.name AS category_name, c.color AS category_color
       FROM articles a
       JOIN users u ON u.id = a.author_id
       JOIN categories c ON c.id = a.category_id
       WHERE a.status = 'published'
         AND (a.title ILIKE $1 OR a.excerpt ILIKE $1 OR a.content ILIKE $1)
       ORDER BY a.published_at DESC
       LIMIT $2 OFFSET $3`,
      [pattern, Number(limit), offset]
    );

    const data = rows.map((r) => ({
      id: String(r.id),
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      cover: r.cover_url,
      publishedAt: r.published_at,
      viewsCount: r.views,
      readingTime: r.reading_time,
      author: { id: String(r.author_id), slug: r.author_slug, name: r.author_name, avatar: r.author_avatar },
      category: { id: String(r.category_id), slug: r.category_slug, name: r.category_name, color: r.category_color },
      tags: [],
    }));

    res.json({
      data,
      meta: { page: Number(page), limit: Number(limit), total, totalPages },
    });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};