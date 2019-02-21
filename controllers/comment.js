var comment = require("../models/comment.js");
var { responseClient } = require("../utils");
// var to = require('await-to-js').default

// 添加文章
async function createComment(ctx, next) {
  await next();
  let { 
    article,
    email,
    text
  } = ctx.request.body;
  
  if (!article) {
    return responseClient(ctx.response, 200, '9999', "评论添加失败：评论的文章不存在！");
  } else if (!email) {
    return responseClient(ctx.response, 200, '9999', "评论添加失败：邮件地址不能为空！");
  } else if (!text) {
    return responseClient(ctx.response, 200, '9999', "评论添加失败：评论正文不能为空！");
  } else if (!text.trim()) {
    return responseClient(ctx.response, 200, '9999', "评论添加失败：评论正文不能全为空白字符串！");
  }

  let result = await comment.create({
    article,
    email,
    text,
    ip: ctx.request.ip
  });
  if (result) {
    responseClient(ctx.response, 200, '0000', "评论添加成功，请等待后台审核！");
  } else {
    responseClient(ctx.response, 200, '9999', "评论添加失败");
  }
}

module.exports = {
  createComment
};
