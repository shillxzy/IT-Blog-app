const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const articlesRoutes = require('./routes/articles.routes');
const categoriesRoutes = require('./routes/categories.routes');
const tagsRoutes = require('./routes/tags.routes');
const authorsRoutes = require('./routes/authors.routes');
const searchRoutes = require('./routes/search.routes');

app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/search', searchRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
