// src/controllers/articles.controller.js
const pool = require('../db/pool');

// Helper: форматування статті з JOIN-ів
function formatArticle(row) {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    cover: row.cover_url,
    status: row.status,
    viewsCount: row.views,
    readingTime: row.reading_time,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    author: {
      id: String(row.author_id),
      slug: row.author_slug,
      name: row.author_name,
      avatar: row.author_avatar,
      bio: row.author_bio,
      social: {
        github: row.author_github,
        linkedin: row.author_linkedin,
      },
    },
    category: {
      id: String(row.category_id),
      slug: row.category_slug,
      name: row.category_name,
      color: row.category_color,
    },
    tags: [],
  };
}

// Helper: додати теги до статей
async function attachTags(articles) {
  if (!articles.length) return articles;
  const ids = articles.map((a) => a.id);
  const { rows } = await pool.query(
    `SELECT at.article_id, t.id, t.slug, t.name
     FROM article_tags at
     JOIN tags t ON t.id = at.tag_id
     WHERE at.article_id = ANY($1::int[])`,
    [ids]
  );
  const tagMap = {};
  for (const row of rows) {
    const aid = String(row.article_id);
    if (!tagMap[aid]) tagMap[aid] = [];
    tagMap[aid].push({ id: String(row.id), slug: row.slug, name: row.name });
  }
  return articles.map((a) => ({ ...a, tags: tagMap[a.id] ?? [] }));
}

const BASE_SELECT = `
  SELECT
    a.id, a.slug, a.title, a.excerpt, a.content, a.cover_url,
    a.status, a.views, a.reading_time, a.meta_title, a.meta_description,
    a.published_at, a.created_at, a.updated_at,
    u.id   AS author_id,   u.slug AS author_slug,   u.name AS author_name,
    u.avatar_url AS author_avatar, u.bio AS author_bio,
    u.github AS author_github, u.linkedin AS author_linkedin,
    c.id   AS category_id, c.slug AS category_slug, c.name AS category_name,
    c.color AS category_color
  FROM articles a
  JOIN users u ON u.id = a.author_id
  JOIN categories c ON c.id = a.category_id
`;

// GET /api/articles
exports.getAll = async (req, res) => {
  try {
    const { category, tag, author, status, q, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const conditions = [`a.status = $1`];
    const params = [status ?? 'published'];
    let idx = 2;

    if (category) { conditions.push(`c.slug = $${idx++}`); params.push(category); }
    if (author)   { conditions.push(`u.slug = $${idx++}`); params.push(author); }
    if (q) {
      conditions.push(`(a.title ILIKE $${idx} OR a.excerpt ILIKE $${idx} OR a.content ILIKE $${idx})`);
      params.push(`%${q}%`); idx++;
    }
    if (tag) {
      conditions.push(`EXISTS (
        SELECT 1 FROM article_tags at2
        JOIN tags t2 ON t2.id = at2.tag_id
        WHERE at2.article_id = a.id AND t2.slug = $${idx++}
      )`);
      params.push(tag);
    }

    const where = 'WHERE ' + conditions.join(' AND ');

    const countRes = await pool.query(
      `SELECT COUNT(*) FROM articles a JOIN users u ON u.id=a.author_id JOIN categories c ON c.id=a.category_id ${where}`,
      params
    );
    const total = Number(countRes.rows[0].count);
    const totalPages = Math.max(1, Math.ceil(total / Number(limit)));

    const { rows } = await pool.query(
      `${BASE_SELECT} ${where} ORDER BY a.published_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, Number(limit), offset]
    );

    let articles = rows.map(formatArticle);
    articles = await attachTags(articles);

    // Повертаємо ArticleCard (без content)
    const data = articles.map(({ content, ...card }) => card);

    res.json({
      data,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

// GET /api/articles/slugs
exports.getSlugs = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.slug AS article_slug, c.slug AS category_slug
       FROM articles a JOIN categories c ON c.id = a.category_id
       WHERE a.status = 'published'`
    );
    res.json(rows.map((r) => ({ categorySlug: r.category_slug, articleSlug: r.article_slug })));
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

// GET /api/articles/:slug
exports.getBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query(`${BASE_SELECT} WHERE a.slug = $1`, [req.params.slug]);
    if (!rows.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Article not found' } });
    }
    const [article] = await attachTags([formatArticle(rows[0])]);

    // Increment views
    await pool.query('UPDATE articles SET views = views + 1 WHERE slug = $1', [req.params.slug]);
    article.viewsCount += 1;

    res.json({ data: article });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

// GET /api/articles/:slug/related
exports.getRelated = async (req, res) => {
  try {
    const { rows: source } = await pool.query(
      'SELECT id, category_id FROM articles WHERE slug = $1', [req.params.slug]
    );
    if (!source.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Article not found' } });
    }
    const { id, category_id } = source[0];
    const { rows } = await pool.query(
      `${BASE_SELECT} WHERE a.category_id = $1 AND a.id != $2 AND a.status = 'published' LIMIT 3`,
      [category_id, id]
    );
    let articles = rows.map(formatArticle);
    articles = await attachTags(articles);
    const data = articles.map(({ content, ...card }) => card);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

// POST /api/articles/:id/view
exports.incrementView = async (req, res) => {
  try {
    await pool.query('UPDATE articles SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json({ data: { ok: true } });
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
