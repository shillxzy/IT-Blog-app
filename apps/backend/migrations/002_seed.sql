-- migrations/002_seed.sql
-- Тестові дані для IT Blog

-- ── Категорії ─────────────────────────────────────────────
INSERT INTO categories (name, slug, description, color, cover_url) VALUES
('Frontend',    'frontend',    'React, Next.js, TypeScript і сучасний веб.',              '#0ea5e9', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80'),
('Productivity','productivity','Практики для ефективної роботи і фокусу.',                '#f59e0b', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80'),
('Backend',     'backend',     'Node.js, бази даних, API та серверна розробка.',          '#10b981', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80'),
('DevOps',      'devops',      'CI/CD, Docker, хмарні платформи та автоматизація.',      '#8b5cf6', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80'),
('AI & ML',     'ai',          'Штучний інтелект, машинне навчання та LLM.',              '#ec4899', 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80')
ON CONFLICT (slug) DO NOTHING;

-- ── Автори (пароль: password123 → bcrypt хеш) ─────────────
-- Примітка: в реальному проєкті хешуйте паролі через bcrypt у коді
INSERT INTO users (name, slug, email, password, bio, avatar_url, website, github, linkedin, is_admin) VALUES
(
  'Олег Коваль', 'oleh-koval', 'oleh@itblog.pp.ua',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Frontend-розробник та автор матеріалів про React і UX. 4 роки досвіду в продуктових компаніях.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  'https://example.com', 'octocat', 'octocat', TRUE
),
(
  'Ірина Бондар', 'iryna-bondar', 'iryna@itblog.pp.ua',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Пише про продуктивність, дизайн-системи та командні процеси. 5 років в IT як PM та розробник.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  NULL, NULL, NULL, FALSE
)
ON CONFLICT (slug) DO NOTHING;

-- ── Теги ──────────────────────────────────────────────────
INSERT INTO tags (name, slug) VALUES
('Next.js',    'nextjs'),
('React',      'react'),
('Workflow',   'workflow'),
('Node.js',    'nodejs'),
('Docker',     'docker'),
('TypeScript', 'typescript'),
('LLM',        'llm'),
('PostgreSQL', 'postgresql')
ON CONFLICT (slug) DO NOTHING;

-- ── Статті ────────────────────────────────────────────────
INSERT INTO articles (title, slug, excerpt, content, cover_url, author_id, category_id, status, views, reading_time, meta_title, meta_description, published_at) VALUES
(
  'Старт із Next.js 16: що змінилося',
  'start-with-nextjs-16',
  'Короткий огляд нових можливостей Next.js 16 та поради для старту.',
  '<h2>App Router</h2><p>Next.js 16 продовжує розвиток App Router з покращеною продуктивністю та новими API. Server Components дозволяють рендерити компоненти на сервері без надсилання JS на клієнт.</p><h2>Turbopack стабільний</h2><p>Turbopack тепер стабільний за замовчуванням і забезпечує до 700x швидшу збірку порівняно з Webpack.</p><h2>Висновок</h2><p>Next.js 16 — це зрілий фреймворк з чудовою підтримкою SSR/SSG та вбудованою оптимізацією.</p>',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  1, 1, 'published', 1280, 6,
  'Старт із Next.js 16 — що нового',
  'Огляд ключових змін у Next.js 16: Turbopack, App Router і нові можливості.',
  '2026-05-01 09:00:00'
),
(
  'Чиста архітектура компонентів у React',
  'clean-component-architecture',
  'Як розділяти UI-компоненти, фічі та бізнес-логіку.',
  '<h2>Проблема спагеті-компонентів</h2><p>Більшість React-проєктів зрештою перетворюються на монолітні компоненти, де логіка, стейт і UI змішані разом.</p><h2>Рішення: розділення відповідальностей</h2><p>Поділяйте компоненти на три шари: Presentational (лише UI), Container (логіка і стейт) та Page (збирає все разом).</p><h2>Хуки як сервіси</h2><p>Виносьте складну логіку в кастомні хуки — це дозволяє тестувати логіку окремо від UI.</p>',
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=80',
  1, 1, 'published', 824, 8,
  'Чиста архітектура React компонентів',
  'Практичний гід по структурі React компонентів: як уникнути спагеті-коду.',
  '2026-05-02 09:00:00'
),
(
  'Методи фокусу для розробників',
  'focus-methods-for-devs',
  'Практичний набір технік, щоб менше відволікатись.',
  '<h2>Проблема уваги у 2026</h2><p>Сучасний розробник в середньому перемикається між задачами кожні 3 хвилини. Це катастрофа для продуктивності.</p><h2>Техніка Pomodoro</h2><p>25 хвилин глибокої роботи + 5 хвилин перерви. Після 4 помідорів — 20 хвилин довгої перерви.</p><h2>Deep Work</h2><p>Виділяйте щоденно мінімум 2 години без Slack, пошти та соцмереж.</p>',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
  2, 2, 'published', 674, 5,
  'Методи фокусу для розробників',
  'Практичні техніки для глибокої роботи: Pomodoro, Deep Work та інструменти концентрації.',
  '2026-05-03 09:00:00'
),
(
  'Шаблон тижневого планування',
  'weekly-planning-template',
  'Проста структура планування для команд і соло-розробників.',
  '<h2>Навіщо планувати тиждень?</h2><p>Без чіткого плану більшість задач ніколи не потрапляє в статус виконано.</p><h2>Шаблон</h2><p>Понеділок: огляд backlog. Середа: check-in прогресу. П''ятниця: ретроспектива та планування.</p>',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80',
  2, 2, 'published', 411, 4,
  'Шаблон тижневого планування для розробників',
  'Простий шаблон тижневого планування для індивідуальних розробників і технічних команд.',
  '2026-05-04 09:00:00'
),
(
  'REST API на Node.js: кращі практики 2026',
  'nodejs-rest-api-best-practices',
  'Структура проєкту, валідація, помилки та документація.',
  '<h2>Структура проєкту</h2><p>Розділяйте роути, контролери та сервіси. Контролер лише приймає HTTP-запит і делегує логіку сервісу.</p><h2>Валідація</h2><p>Використовуйте Zod або Joi для валідації вхідних даних.</p><h2>Стандартизація помилок</h2><p>Завжди повертайте однаковий формат: { error: { code, message } }.</p>',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
  1, 3, 'published', 953, 9,
  'REST API на Node.js — кращі практики',
  'Практичний гід по Node.js REST API: структура, валідація, обробка помилок і Swagger.',
  '2026-05-05 09:00:00'
),
(
  'PostgreSQL індекси: повний гід',
  'postgresql-indexing-guide',
  'Коли і як використовувати індекси для оптимізації запитів.',
  '<h2>Що таке індекс?</h2><p>Індекс — це структура даних яка прискорює пошук по таблиці. Без індексу PostgreSQL виконує full table scan.</p><h2>B-tree індекси</h2><p>Найпоширеніший тип. Підходить для = та діапазонних запитів.</p><h2>Коли НЕ використовувати</h2><p>Для таблиць з частими INSERT/UPDATE індекси сповільнюють запис.</p>',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80',
  2, 3, 'published', 612, 11,
  'PostgreSQL індекси — повний гід',
  'Вичерпний гід по індексах PostgreSQL: типи, коли використовувати та як оптимізувати запити.',
  '2026-05-06 09:00:00'
),
(
  'Docker для розробників: з нуля до production',
  'docker-for-developers',
  'Контейнеризація застосунків та docker-compose для локальної розробки.',
  '<h2>Навіщо Docker?</h2><p>Docker вирішує проблему "на моєму комп''ютері працює". Ваш застосунок запускається однаково на будь-якій машині.</p><h2>Dockerfile</h2><p>Це інструкція для збирання образу. Починайте з легкого базового образу: node:20-alpine.</p><h2>docker-compose</h2><p>Для локальної розробки з БД використовуйте docker-compose.</p>',
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80',
  1, 4, 'published', 1103, 12,
  'Docker для розробників — від нуля до production',
  'Практичний курс по Docker: Dockerfile, docker-compose, мережі та деплой в production.',
  '2026-05-07 09:00:00'
),
(
  'CI/CD з GitHub Actions: автоматизуй деплой',
  'ci-cd-with-github-actions',
  'Налаштування автоматичного тестування та деплою на Railway.',
  '<h2>Що таке CI/CD?</h2><p>Continuous Integration — автоматичне тестування при кожному push. Continuous Deployment — автоматичний деплой після успішних тестів.</p><h2>GitHub Actions</h2><p>Безкоштовний CI/CD від GitHub. Налаштовується через YAML файли в .github/workflows.</p>',
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
  2, 4, 'published', 788, 7,
  'CI/CD з GitHub Actions',
  'Покроковий гід по налаштуванню CI/CD pipeline з GitHub Actions для автоматичного деплою.',
  '2026-05-08 09:00:00'
),
(
  'Вступ до LLM API: Claude, GPT та Gemini',
  'intro-to-llm-apis',
  'Порівняння провідних LLM API та поради для вибору.',
  '<h2>Ринок LLM у 2026</h2><p>Claude від Anthropic, GPT від OpenAI та Gemini від Google — три провідних гравці. Кожен має свої сильні сторони.</p><h2>Claude API</h2><p>Відмінний для аналізу документів і коду. Має велике контекстне вікно до 200K токенів.</p><h2>Як обрати?</h2><p>Для кодування — Claude або GPT-4o. Для cost-efficiency — менші моделі типу Haiku.</p>',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
  1, 5, 'published', 1547, 8,
  'Вступ до LLM API — Claude, GPT та Gemini',
  'Порівняння LLM API: Claude, GPT та Gemini. Як обрати правильну модель для свого проєкту.',
  '2026-05-09 09:00:00'
),
(
  'Побудова RAG застосунків на Node.js',
  'building-rag-applications',
  'Retrieval-Augmented Generation: архітектура та реалізація.',
  '<h2>Що таке RAG?</h2><p>RAG (Retrieval-Augmented Generation) — підхід який поєднує векторний пошук із генерацією тексту LLM. Дозволяє відповідати на питання на основі власних документів.</p><h2>Архітектура</h2><p>1. Індексація документів → embedding → vector DB. 2. Запит → пошук схожих документів → контекст для LLM → відповідь.</p>',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
  2, 5, 'published', 921, 13,
  'Побудова RAG застосунків на Node.js',
  'Практичний гід по Retrieval-Augmented Generation: векторні бази даних та Claude API.',
  '2026-05-10 09:00:00'
)
ON CONFLICT (slug) DO NOTHING;

-- ── Зв'язки статей і тегів ────────────────────────────────
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE (a.slug = 'start-with-nextjs-16'          AND t.slug IN ('nextjs','react','typescript'))
   OR (a.slug = 'clean-component-architecture'  AND t.slug IN ('react','workflow','typescript'))
   OR (a.slug = 'focus-methods-for-devs'        AND t.slug IN ('workflow'))
   OR (a.slug = 'weekly-planning-template'      AND t.slug IN ('workflow'))
   OR (a.slug = 'nodejs-rest-api-best-practices'AND t.slug IN ('nodejs','typescript'))
   OR (a.slug = 'postgresql-indexing-guide'     AND t.slug IN ('postgresql'))
   OR (a.slug = 'docker-for-developers'         AND t.slug IN ('docker'))
   OR (a.slug = 'ci-cd-with-github-actions'     AND t.slug IN ('docker','nodejs'))
   OR (a.slug = 'intro-to-llm-apis'             AND t.slug IN ('llm'))
   OR (a.slug = 'building-rag-applications'     AND t.slug IN ('llm','nodejs'))
ON CONFLICT DO NOTHING;
