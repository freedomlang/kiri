var upload = require('../models/upload.js');
const { responseClient } = require('../utils');

async function processUploadFile (ctx, next) {
    await next();
    let result = [];
    const { userId } = ctx.request;
    for (const key in ctx.request.files) {
        const { name, originalName, type: fileType } = ctx.request.files[key];
        await upload.create({
            createdBy: userId,
            modifiedBy: userId,
            fileType,
            fileName: name,
            originalFileName: originalName
        });
        result.push({
            name,
            originalName
        })
    }
    
    responseClient(ctx.response, 200, '0000', '上传成功', result)
}

module.exports = {
    processUploadFile
}
