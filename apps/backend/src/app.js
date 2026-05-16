const express = require('express');
const app = express();

app.use(express.json());

const articlesRoutes = require('./routes/articles.routes');
app.use('/api/articles', articlesRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;