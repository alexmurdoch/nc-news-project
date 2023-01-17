const db = require("../db/connection");

const fetchTopics = () => {
  return db
    .query(
      `
    SELECT * FROM topics;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

const fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count
    FROM comments
     RIGHT JOIN articles ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

const fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      const article = result.rows[0];

      if (article === undefined) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      } else {
        return result.rows[0];
      }
    });
};

module.exports = { fetchTopics, fetchArticles, fetchArticleById };
