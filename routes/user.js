var { login } = require('../controllers/auth.js');
const koaBody = require('koa-body');

function init(router) {
    router.post('/login', koaBody(), login);
}

module.exports = {
    init
}