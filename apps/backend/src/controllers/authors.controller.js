// src/controllers/authors.controller.js
const pool = require('../db/pool');

function fmt(row) {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    email: row.email,
    avatar: row.avatar_url,
    bio: row.bio,
    website: row.website,
    social: { github: row.github, linkedin: row.linkedin },
    articlesCount: Number(row.articles_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.*, COUNT(a.id) AS articles_count
       FROM users u
       LEFT JOIN articles a ON a.author_id = u.id AND a.status = 'published'
       GROUP BY u.id ORDER BY u.name`
    );
    res.json({ data: rows.map(fmt) });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getSlugs = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT slug FROM users');
    res.json(rows.map((r) => r.slug));
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.*, COUNT(a.id) AS articles_count
       FROM users u
       LEFT JOIN articles a ON a.author_id = u.id AND a.status = 'published'
       WHERE u.slug = $1 GROUP BY u.id`,
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Author not found' } });
    }
    res.json({ data: fmt(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
