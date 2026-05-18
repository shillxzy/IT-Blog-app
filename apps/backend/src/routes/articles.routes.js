const express = require('express');
const router = express.Router();
const c = require('../controllers/articles.controller');

router.get('/slugs', c.getSlugs);
router.get('/', c.getAll);
router.get('/:slug/related', c.getRelated);
router.get('/:slug', c.getBySlug);
router.post('/:id/view', c.incrementView);

module.exports = router;