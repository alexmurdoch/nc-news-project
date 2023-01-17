
const {fetchTopics, fetchArticles, fetchArticleById} = require('../models/models')





const getTopics = (req, res) => {
    fetchTopics().then((topics)=>{
        
        res.status(200).send({topics})
    })
}

const getArticles = (req, res) => {
    fetchArticles().then((articles)=>{
       
        res.status(200).send({articles})
    })
}

const getArticleById = (req, res) => {
const {article_id} = req.params

    fetchArticleById(article_id).then((article)=>{

        res.status(200).send({article})
    })
}

module.exports = {getTopics, getArticles, getArticleById}