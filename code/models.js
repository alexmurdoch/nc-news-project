const db = require("../db/connection");
const fs = require("fs/promises");
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

const fetchArticles = (query) => {
  const search = query.topic || "";
  const sort = query.sort_by || "created_at";
  const direction = query.order || "desc";

  if (
    ["id", "created_at", "topic", "body", "votes", "author", "title"].includes(
      sort
    ) === false
  ) {
    return Promise.reject({
      status: 400,
      msg: "invalid sort_by query",
    });
  }

  if (["asc", "desc"].includes(direction) === false) {
    return Promise.reject({
      status: 400,
      msg: "invalid order query",
    });
  }
  if (typeof search !== "string") {
    return Promise.reject({
      status: 400,
      msg: "invalid topic query format",
    });
  }

  return db
    .query(
      `
      SELECT articles.*, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      ${search ? "WHERE topic = $1" : ""}
      GROUP BY articles.article_id
      ORDER BY ${sort} ${direction}
    `,
      search ? [search] : []
    )
    .then((result) => {
      const unfiltered = result.rows;
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No data for this topic",
        });
      }
      return unfiltered;
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

const fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at;`,
      [article_id]
    )
    .then((result) => {
      const comments = result.rows;

      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comments for given article",
        });
      } else {
        let output = (result.rows, { comment_count: result.rows.length });

        return [result.rows, { comment_count: result.rows.length }];
      }
    });
};

const addCommentByArticleId = (article_id, post) => {
  const { username, body } = post;

  return db
    .query(
      `INSERT INTO comments
  (article_id, author, body)
  VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then((comment) => {
      return comment.rows[0].body;
    });
};

const addVotes = (article_id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + ($2) WHERE article_id = ($1) RETURNING *`,
      [article_id, votes]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid article ID or no votes passed",
        });
      } else {
        return article.rows[0];
      }
    });
};

const fetchUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

const removeComment = (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "article_id is the wrong data type",
    });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id= $1 RETURNING*;`, [id])
    .then((deleted) => {
      const deletedComment = deleted.rows;
      if (deletedComment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }
    });
};

const getJson = () => {
  return fs.readFile("endpoints.json", () => {});
};

module.exports = {
  fetchUsers,
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  addVotes,
  removeComment,
  getJson,
};
