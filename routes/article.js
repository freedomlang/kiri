var { getArticles, getArticleDetail, deleteArticle, addArticle, updateArticle } = require('../controllers/article.js');
const koaBody = require('koa-body');

function init(router) {
    router.post('/getArticles', koaBody(), getArticles);
    router.get('/article/:id', koaBody(), getArticleDetail);
    router.post('/addArticle', koaBody(), addArticle);
    router.post('/updateArticle', koaBody(), updateArticle);
    router.del('/delete_article/:id', koaBody(), deleteArticle);

    return router;
}

module.exports = {
    init
}