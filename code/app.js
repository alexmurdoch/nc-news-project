const express = require("express");
const app = express();

const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
  getUsers,
} = require("./controllers");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleByArticleId);
app.get("/api/users", getUsers);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(404).send({ msg: "Invalid data type" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
  console.log(err);
});

module.exports = app;
