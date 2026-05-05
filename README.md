# Технічне завдання на проєкт

## "IT Blog" - Новинний блог про інформаційні технології

**Дисципліна:** Проєктно-технологічна практика
**Тип роботи:** Командний проєкт (команда групи 2 студенти)

---

## 1. Загальний опис проєкту

Команда розробляє повноцінний новинний блог на IT тематику. Проєкт є основою для всіх завдань протягом
періоду практики - кожне завдання покращує та розширює цей самий сайт. Наприкінці практики студенти матимуть реально
працюючий, SEO-оптимізований вебзастосунок у production середовищі.

### Тематика контенту

Блог висвітлює новини та статті за категоріями:

- JavaScript / Frontend розробка
- Backend та DevOps
- Штучний інтелект та ML
- Кібербезпека
- Огляди інструментів та технологій

---

## 2. Технічний стек

### Frontend - ОБОВ'ЯЗКОВО з SSR

Команда обирає **один** варіант:

| Варіант | Технологія               | Рендеринг       |
|---------|--------------------------|-----------------|
| A       | **Next.js** (App Router) | React + SSR/SSG |
| B       | **Nuxt 3**               | Vue + SSR/SSG   |

> ⚠️ CSR (чистий React або Vue без SSR фреймворку) **не допускається**.  
> Вибір фіксується на першій зустрічі з викладачем і не змінюється.

### Backend - на вибір команди

Команда обирає **один** варіант:

| Варіант | Технологія                                            |
|---------|-------------------------------------------------------|
| A       | Node.js + Express                                     |
| B       | Node.js + Fastify                                     |
| C       | Node.js + NestJS                                      |
| D       | Будь який інший фреймворк (погоджується з викладачем) |

### База даних

**PostgreSQL** або б.я. інша (погодити з викладачем).  
Надається стартова схема (див. розділ 5).

### Хостинг

**Railway** абр на вибір студента.  
Три сервіси в одному проєкті: Frontend, Backend, PostgreSQL.

---

## 3. Функціональні вимоги

### 3.1 Публічна частина (обов'язкова для SEO)

#### Головна сторінка `/`

- Список останніх статей (не менше 10)
- Фільтрація за категоріями
- Пагінація або infinite scroll
- Анонс кожної статті: заголовок, обкладинка, категорія, автор, дата, короткий опис

#### Сторінка категорії `/categories/[slug]`

- Назва та опис категорії
- Список статей цієї категорії
- Пагінація

#### Сторінка статті `/categories/[slug]/[id]`

- Повний текст статті
- Заголовок, обкладинка, дата публікації
- Ім'я автора з посиланням на його профіль
- Теги статті
- Список пов'язаних статей (та сама категорія)
- Кількість переглядів

#### Сторінка автора `/authors/[slug]`

- Ім'я, фото, біографія
- Список статей автора

#### Сторінка тегу `/tags/[slug]`

- Список статей з цим тегом

#### Пошук `/search?q=...`

- Пошук за заголовком та текстом статей
- Відображення результатів

### 3.2 Адмін панель `/admin`

- Авторизація (логін + пароль)
- CRUD статей (створити, переглянути, редагувати, видалити)
- CRUD категорій та тегів
- Завантаження зображень (обкладинки статей)
- Список авторів

> Адмін панель **не індексується** пошуковими системами (robots.txt).

### 3.3 Технічні SEO-сторінки (додаються поступово протягом семестру)

- `/sitemap.xml` - динамічний sitemap
- `/robots.txt` - правила для краулерів
- `/rss.xml` - RSS feed

---

## 4. Нефункціональні вимоги

### SSR / SSG стратегія

| Сторінка  | Стратегія        | Причина                                  |
|-----------|------------------|------------------------------------------|
| Головна   | SSG + revalidate | Висока відвідуваність, оновлюється рідко |
| Стаття    | SSR або ISR      | Унікальний контент, лічильник переглядів |
| Категорія | SSG + revalidate | Рідко змінюється                         |
| Автор     | SSG              | Статичні дані                            |
| Пошук     | CSR + API        | Динамічні запити                         |
| Адмін     | CSR              | Не потребує SEO                          |

### SEO вимоги (додаються поступово протягом семестру)

- Унікальні `<title>` та `<meta description>` для кожної сторінки
- Open Graph теги для соцмереж
- Canonical URL
- Structured Data (JSON-LD) для статей
- Семантична HTML розмітка
- Оптимізовані зображення (next/image або nuxt/image)

### Продуктивність (виконується поступово протягом семестру)

- Lighthouse Performance Score > 80
- Core Web Vitals у зеленій зоні
- Зображення у форматі WebP або AVIF

---

## 5. Приблизна структура бази даних (стартова схема)

```sql
-- Автори / користувачі
CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    bio        TEXT,
    avatar_url VARCHAR(500),
    is_admin   BOOLEAN   DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Категорії
CREATE TABLE categories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Статті
CREATE TABLE articles
(
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(300) NOT NULL,
    slug             VARCHAR(300) NOT NULL UNIQUE,
    excerpt          TEXT,                        -- короткий опис для анонсу
    content          TEXT         NOT NULL,
    cover_url        VARCHAR(500),
    author_id        INTEGER REFERENCES users (id),
    category_id      INTEGER REFERENCES categories (id),
    status           VARCHAR(20) DEFAULT 'draft', -- draft | published
    views            INTEGER     DEFAULT 0,
    meta_title       VARCHAR(300),                -- SEO заголовок
    meta_description VARCHAR(500),                -- SEO опис
    published_at     TIMESTAMP,
    created_at       TIMESTAMP   DEFAULT NOW(),
    updated_at       TIMESTAMP   DEFAULT NOW()
);

-- Теги
CREATE TABLE tags
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Зв'язок статей та тегів (many-to-many)
CREATE TABLE article_tags
(
    article_id INTEGER REFERENCES articles (id) ON DELETE CASCADE,
    tag_id     INTEGER REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Індекси для швидкого пошуку
CREATE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_articles_status ON articles (status);
CREATE INDEX idx_articles_category ON articles (category_id);
CREATE INDEX idx_articles_author ON articles (author_id);
CREATE INDEX idx_articles_published ON articles (published_at DESC);
```

---

## 6. REST API - стартова специфікація (можен)

### Публічні ендпоінти

```
GET  /api/articles                    - список статей (з пагінацією)
GET  /api/articles/:slug              - стаття за slug
GET  /api/articles/:slug/related      - пов'язані статті
POST /api/articles/:id/view           - збільшити лічильник переглядів

GET  /api/categories                  - всі категорії
GET  /api/categories/:slug/articles   - статті категорії

GET  /api/tags                        - всі теги
GET  /api/tags/:slug/articles         - статті тегу

GET  /api/authors/:slug               - профіль автора
GET  /api/authors/:slug/articles      - статті автора

GET  /api/search?q=...                - пошук статей
```

### Захищені ендпоінти (потребують JWT)

```
POST   /api/auth/login                - авторизація
POST   /api/auth/logout               - вихід

GET    /api/admin/articles            - всі статті (включно з чернетками)
POST   /api/admin/articles            - створити статтю
PUT    /api/admin/articles/:id        - оновити статтю
DELETE /api/admin/articles/:id        - видалити статтю

POST   /api/admin/upload              - завантажити зображення

GET    /api/admin/categories          - список категорій
POST   /api/admin/categories          - створити категорію
PUT    /api/admin/categories/:id      - оновити категорію
DELETE /api/admin/categories/:id      - видалити категорію
```

### Формат відповіді (обов'язковий)

```json
// Список з пагінацією
{
    "data": [
        ...
    ],
    "meta": {
        "total": 100,
        "page": 1,
        "perPage": 10,
        "totalPages": 10
    }
}

// Один об'єкт
{
    "data": {
        ...
    }
}

// Помилка
{
    "error": {
        "code": "NOT_FOUND",
        "message": "Article not found"
    }
}
```

---

## 7. Структура репозиторію

```
it-blog/
├── apps/
│   ├── frontend/              ← Next.js або Nuxt 3
│   │   ├── app/ або pages/
│   │   ├── components/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── backend/               ← Node.js (будь-який фреймворк)
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── models/
│       │   └── middleware/
│       ├── migrations/        ← SQL файли міграцій
│       └── package.json
│
├── .env.example               ← шаблон змінних середовища
├── docker-compose.yml         ← локальна розробка
└── README.md
```

---

## 8. Організація роботи в команді

### Розподіл ролей

| Роль               | Відповідальність                              |
|--------------------|-----------------------------------------------|
| Frontend розробник | Next.js / Nuxt, компоненти, SSR/SSG стратегія |
| Backend розробник  | REST API, БД, автентифікація                  |
| Всі разом          | SEO завдання кожного завдання                 |

> У командах де є третій учасник - він відповідає за DevOps (Railway, CI/CD) та контент блогу.

### Workflow

- Основна гілка: `main` - тільки робочий код
- Розробка: feature-гілки (`feature/article-page`, `feature/sitemap`)
- Pull Request перед злиттям в `main`
- Кожен deploy на Railway відбувається автоматично при push в `main`

---

## 9. Заборонено

- ❌ CSR без SSR (чистий React/Vue без Next.js/Nuxt)
- ❌ Статичний HTML без фреймворку
- ❌ Використання готових CMS (WordPress, Ghost тощо)
- ❌ Копіювання чужого коду без розуміння
- ❌ Зміна вибраного фреймворку після Лаб 1

---

## 10. Корисні посилання

- [Railway документація](https://docs.railway.app)
- [Next.js документація](https://nextjs.org/docs)
- [Nuxt 3 документація](https://nuxt.com/docs)
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org - Article](https://schema.org/Article)
- [web.dev - Core Web Vitals](https://web.dev/vitals)
- [PageSpeed Insights](https://pagespeed.web.dev)
