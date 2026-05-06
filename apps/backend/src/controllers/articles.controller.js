const articles = [
  {
    id: 1,
    slug: "first-article",
    title: "First article",
    content: "This is test article",
    excerpt: "short text"
  }
];

exports.getAll = (req, res) => {
  res.json({
    data: articles
  });
};

exports.getBySlug = (req, res) => {
  const article = articles.find(a => a.slug === req.params.slug);

  if (!article) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Article not found"
      }
    });
  }

  res.json({
    data: article
  });
};