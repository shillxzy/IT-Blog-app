require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const articlesRoutes = require('./routes/articles.routes');
const tagsRoutes = require('./routes/tags.routes');
const categoriesRoutes = require('./routes/categories.routes');
const authorsRoutes = require('./routes/authors.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.use('/api/articles', articlesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/search', searchRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ message: 'IT Blog API is running', docs: '/api-docs' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});