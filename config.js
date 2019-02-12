"use strict";
const path = require('path'),
  serverRoot = path.dirname(__dirname),
  root = path.resolve(serverRoot,'../'),
  staticDir = path.join(root, 'static');
// 默认生产环境
let config = {
  app: {
    name:'kov-blog',
    port: 3000,
    apiPath: '/api' // 后台路径
  },
  debug:false,
  env:'production',
  mongodb: { // 数据库配置
    url: 'mongodb://localhost/kiri',
    user:'',
    password:''
  },
  jwt: {
    cert: 'kiri'
  },
  upload: {
    uploadDir: path.resolve(__dirname, 'uploads'),
    maxFileSize: 900*1024*1024  // 9M
  },
  dir: { // 目录配置
    root,
    log: path.join(__dirname,'..', 'logs'),
    server:serverRoot,
    static: staticDir,
    resource: path.join(serverRoot, 'resource'),
    upload: path.join(serverRoot,'resource', 'upload')
  },
};

module.exports = config;