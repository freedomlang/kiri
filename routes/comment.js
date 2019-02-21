const { createComment } = require('../controllers/comment.js');
const koaBody = require('koa-body');

function init(router) {
    router.post('/createComment', koaBody(), createComment);    
}

module.exports = {
    init
}