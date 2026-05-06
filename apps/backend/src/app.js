const express = require('express');
const app = express();

app.use(express.json());

// SEO / health check (ВАЖЛИВО)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;

const articlesRoutes = require('./routes/articles.routes');

app.use('/api', articlesRoutes);