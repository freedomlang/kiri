var upload = require('../models/upload.js');
const { responseClient } = require('../utils')
var config = require('../config.js');
const fs = require('fs');
const dayjs = require("dayjs");

async function processUploadFile (ctx, next) {
    await next();
    const currentDate = dayjs(Date.now).format('YYYYMMDD');
    console.log(ctx.request.files);
    // const file = ctx.request.files.file;	// 获取上传文件
    // const uploadDir = config.upload.uploadDir.concat(`/${currentDate}`);
    // checkDirExist(uploadDir);
    let result = [];
    for (const key in ctx.request.files) {
        const { name, originalName } = ctx.request.files[key];
        result.push({
            name,
            originalName
        })
    }
    return responseClient(ctx.response, 200, '0000', '上传成功', result)
}

module.exports = {
    processUploadFile
}
