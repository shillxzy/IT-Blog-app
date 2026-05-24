-- migrations/003_silo_categories.sql
-- Sprint 3-1: Update category descriptions to match semantic silo structure.
-- Each category row is a silo root; description doubles as the meta description
-- for the category page and signals the cluster scope to Google.

UPDATE categories SET
  name        = 'Frontend',
  description = 'JavaScript, TypeScript, React та Next.js — сучасний frontend від основ до продакшн-практик.',
  color       = '#0ea5e9'
WHERE slug = 'frontend';

UPDATE categories SET
  name        = 'Backend',
  description = 'Node.js, Express, REST API та PostgreSQL — побудова серверних застосунків з нуля.',
  color       = '#10b981'
WHERE slug = 'backend';

UPDATE categories SET
  name        = 'DevOps',
  description = 'Docker, CI/CD та GitHub Actions — автоматизація розгортання і підтримка інфраструктури.',
  color       = '#8b5cf6'
WHERE slug = 'devops';

UPDATE categories SET
  name        = 'AI & ML',
  description = 'LLM API, RAG-архітектура та векторні бази даних — AI для практикуючих розробників.',
  color       = '#ec4899'
WHERE slug = 'ai';

UPDATE categories SET
  name        = 'Productivity',
  description = 'Інструменти, техніки фокусу та кар''єрний розвиток для IT-спеціалістів.',
  color       = '#f59e0b'
WHERE slug = 'productivity';

-- Add meta_title column to categories if not exists (for SEO head keyword per silo)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200);

-- Set meta_title to silo head keyword for each category
UPDATE categories SET meta_title = 'JavaScript Tutorial для початківців | IT Blog' WHERE slug = 'frontend';
UPDATE categories SET meta_title = 'Node.js для початківців — Backend розробка | IT Blog' WHERE slug = 'backend';
UPDATE categories SET meta_title = 'DevOps для розробників: Docker та CI/CD | IT Blog' WHERE slug = 'devops';
UPDATE categories SET meta_title = 'LLM API та AI інструменти для розробників | IT Blog' WHERE slug = 'ai';
UPDATE categories SET meta_title = 'Продуктивність програміста: поради та інструменти | IT Blog' WHERE slug = 'productivity';
