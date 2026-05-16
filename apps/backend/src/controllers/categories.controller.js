// src/controllers/categories.controller.js
const pool = require('../db/pool');

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
