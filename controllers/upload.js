var upload = require('../models/upload.js');
var fs = require('fs');
const objectId = require("mongodb").ObjectID;
const { responseClient } = require('../utils');

async function addFile (ctx, next) {
    await next();
    const { userId } = ctx.request;
    const { name, originalName, type: fileType, path } = ctx.request.files.file;
    const createdDocument = await upload.create({
        path,
        createdBy: userId,
        modifiedBy: userId,
        fileType,
        fileName: name,
        originalFileName: originalName
    });
    
    responseClient(ctx.response, 200, '0000', '上传成功', {
        id: createdDocument.id,
        name,
        originalName
    })
}

async function deleteFile(ctx, next) {
    await next();
    const _id = objectId(ctx.request.body.id);
    const result = await upload.findByIdAndRemove(_id).exec();

    if (result) {
        await fs.unlink(result.path);
        responseClient(ctx.response, 200, '0000', '文件删除成功');
    } else {
        responseClient(ctx.response, 200, "9999", "文章不存在");
    }
}

module.exports = {
    addFile,
    deleteFile
}
