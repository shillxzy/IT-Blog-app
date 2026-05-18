const express = require('express');
const router = express.Router();
const c = require('../controllers/authors.controller');

router.get('/slugs', c.getSlugs);
router.get('/', c.getAll);
router.get('/:slug', c.getBySlug);
router.get('/:slug/articles', c.getArticles);

module.exports = router;
