const express = require("express");
const router = express.Router();
const articlesController = require("../controllers/articles.controller");

/**
 * @openapi
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", articlesController.getAll);

/**
 * @openapi
 * /api/articles/{slug}:
 *   get:
 *     summary: Get article by slug
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Article not found
 */
router.get("/:slug", articlesController.getBySlug);

module.exports = router;