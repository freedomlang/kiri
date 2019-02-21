var Router = require('koa-router');
var routers4user = require('./user');
var routers4article = require('./article');
var routers4comment = require('./comment');
var routers4attachment = require('./attachment');
const { app: { apiPath} } = require('../config');

var router = new Router({
    prefix: apiPath
});

routers4user.init(router)
routers4article.init(router);
routers4comment.init(router);
routers4attachment.init(router)

module.exports = router;