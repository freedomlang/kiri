const Koa = require('koa');
var Router = require('koa-router');
const koaBody = require('koa-body');
var mongoose =  require('mongoose');
var config = require('./config');
// timestamp related
const dayjs = require("dayjs");
const path = require('path');
const uuid = require('uuid/v1');
var jwt_middleware = require('./middlewares/jwt');
var { login } = require('./controllers/auth.js');
var { getArticles, getArticleDetail, deleteArticle, addArticle, updateArticle } = require('./controllers/article.js');
const { addFile, deleteFile } = require('./controllers/upload.js');
const { checkDirExist } = require('./utils')
mongoose.connect(config.mongodb.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const app = new Koa();
var router = new Router();

const { app: { apiPath} } = config;
router.post(apiPath.concat('/login'), koaBody(), login);
router.post(apiPath.concat('/upload'), koaBody({
  multipart: true,
  formidable: {
    maxFileSize: config.upload.maxFileSize,
    onFileBegin:(name,file) => {
      const currentDate = dayjs(Date.now()).format('YYYYMMDD');
      // 获取文件后缀
      const ext = file.name.split('.').pop();
      const randomFileName = `${uuid()}.${ext}`
      file.originalName = file.name;
      file.name = randomFileName;
      // 最终要保存到的文件夹目录
      const dir = path.join(config.upload.uploadDir, `${currentDate}`);
      // 检查文件夹是否存在如果不存在则新建文件夹
      checkDirExist(dir);
      // 重新覆盖 file.path 属性
      file.path = `${dir}/${randomFileName}`;
    }
  }
}), addFile);
router.post(apiPath.concat('/deleteFile'), koaBody(), deleteFile);
router.post(apiPath.concat('/getArticles'), koaBody(), getArticles);
router.get(apiPath.concat('/article/:id'), koaBody(), getArticleDetail);
router.post(apiPath.concat('/addArticle'), koaBody(), addArticle);
router.post(apiPath.concat('/updateArticle'), koaBody(), updateArticle);
router.del(apiPath.concat('/delete_article/:id'), koaBody(), deleteArticle);


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
  .listen(3002);