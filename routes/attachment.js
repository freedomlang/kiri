const dayjs = require("dayjs");
const path = require('path');
const uuid = require('uuid/v1');
const { addFile, deleteFile } = require('../controllers/upload.js');
const { checkDirExist } = require('../utils')
const koaBody = require('koa-body');
const { upload: { maxFileSize, uploadDir } } = require('../config');

function init(router) {
    router.post('/upload', koaBody({
        multipart: true,
        formidable: {
          maxFileSize: maxFileSize,
          onFileBegin:(name,file) => {
            const currentDate = dayjs(Date.now()).format('YYYYMMDD');
            // 获取文件后缀
            const ext = file.name.split('.').pop();
            const randomFileName = `${uuid()}.${ext}`
            file.originalName = file.name;
            file.name = randomFileName;
            // 最终要保存到的文件夹目录
            const dir = path.join(uploadDir, `${currentDate}`);
            // 检查文件夹是否存在如果不存在则新建文件夹
            checkDirExist(dir);
            // 重新覆盖 file.path 属性
            file.path = `${dir}/${randomFileName}`;
          }
        }
      }), addFile);
      router.post('/deleteFile', koaBody(), deleteFile);
}

module.exports = {
    init
}