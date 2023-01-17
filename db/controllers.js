const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
} = require("../models/models");

const getTopics = (req, res) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    
    fetchCommentsByArticleId(article_id).then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
}

module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId };
