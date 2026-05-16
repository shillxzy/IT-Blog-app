// src/controllers/tags.controller.js
const pool = require('../db/pool');

function fmt(row) {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    articlesCount: Number(row.articles_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, COUNT(at.article_id) AS articles_count
       FROM tags t
       LEFT JOIN article_tags at ON at.tag_id = t.id
       GROUP BY t.id ORDER BY t.name`
    );
    res.json({ data: rows.map(fmt) });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getSlugs = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT slug FROM tags');
    res.json(rows.map((r) => r.slug));
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, COUNT(at.article_id) AS articles_count
       FROM tags t
       LEFT JOIN article_tags at ON at.tag_id = t.id
       WHERE t.slug = $1 GROUP BY t.id`,
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tag not found' } });
    }
    res.json({ data: fmt(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
