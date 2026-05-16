-- migrations/001_init.sql
-- Повна схема бази даних IT Blog

-- ── Автори / користувачі ──────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    bio        TEXT,
    avatar_url VARCHAR(500),
    website    VARCHAR(500),
    github     VARCHAR(100),
    linkedin   VARCHAR(100),
    is_admin   BOOLEAN   DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── Категорії ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color       VARCHAR(20),
    cover_url   VARCHAR(500),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ── Статті ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(300) NOT NULL,
    slug             VARCHAR(300) NOT NULL UNIQUE,
    excerpt          TEXT,
    content          TEXT         NOT NULL,
    cover_url        VARCHAR(500),
    author_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category_id      INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    status           VARCHAR(20)  DEFAULT 'draft',
    views            INTEGER      DEFAULT 0,
    reading_time     INTEGER      DEFAULT 5,
    meta_title       VARCHAR(300),
    meta_description VARCHAR(500),
    published_at     TIMESTAMP,
    created_at       TIMESTAMP    DEFAULT NOW(),
    updated_at       TIMESTAMP    DEFAULT NOW()
);

-- ── Теги ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tags (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── Зв'язок статей і тегів (many-to-many) ─────────────────
CREATE TABLE IF NOT EXISTS article_tags (
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    tag_id     INTEGER REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- ── Індекси ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_articles_slug       ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status     ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category   ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author     ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published  ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_slug          ON users(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug     ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug           ON tags(slug);
