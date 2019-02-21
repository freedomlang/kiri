const Koa = require('koa');
const router = require('./routes')
var mongoose =  require('mongoose');
var config = require('./config');
var jwt_middleware = require('./middlewares/jwt');
mongoose.connect(config.mongodb.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const app = new Koa();

app
  .use(jwt_middleware)
  .use(async (ctx, next) => {
    if (ctx.request.header.origin !== ctx.origin) {
      ctx.response.set('Access-Control-Allow-Origin', ctx.request.header.origin || '*');
      ctx.response.set('Access-Control-Allow-Credentials', true);
    }
    await next();
  })
  
  .use(async (ctx, next) => {
    if (ctx.method === 'OPTIONS') {
      ctx.response.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
      ctx.response.set('Access-Control-Allow-Headers', 'Content-Type');
      ctx.response.set('Access-Control-Max-Age', 3600 * 24);
      ctx.response.body = '';
    }
    await next();
  })
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.app.port);