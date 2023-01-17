const express = require('express')
const app = express()


const {getTopics, getArticles, getArticleById}  = require('./controllers');
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
module.exports = app