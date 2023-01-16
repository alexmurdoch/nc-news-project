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
    GROUP BY articles.article_id;`
    )
    .then((result) => {
      return result.rows;
    });
};

module.exports = { fetchTopics, fetchArticles };
