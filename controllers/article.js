var article = require("../models/article.js");
var dayjs = require("dayjs");
var { responseClient, filterUselessData } = require("../utils");
// var to = require('await-to-js').default
const objectId = require("mongodb").ObjectID;

// 获取文章
async function getArticles(ctx, next) {
  let { pageNum, pageSize, ...queryCondition } = ctx.request.body || {};
  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  queryCondition.status = "publish";

  const result = await article.count(queryCondition).then(async count => {
    let queryResult = {
      total: count,
      pageNum
    };

    queryResult.data = await article.aggregate([
      { $match: queryCondition },
      { $sort: { created: 1 } },
      { $skip: skip },
      { $limit: pageSize }
    ]);

    queryResult.data.forEach(perData => {
      perData.created = dayjs(perData.created).format("YYYY-MM-DD hh:mm:ss");
      perData.modified = dayjs(perData.modified).format("YYYY-MM-DD hh:mm:ss");

      // 文章内容限制在200个字符内
      if (perData.text.length > 200) {
        const { 0: matchText, index: matchIndex } =
          /`+\s+/.exec(perData.text) || {};

        perData.text = perData.text.slice(0, matchIndex || 200);
        perData.text += matchIndex ? matchText : ".....";
      }
    });

    return queryResult;
  });
  await next();
  responseClient(ctx.response, 200, "0000", "文章查询成功", result);
}

// 更新文章
async function updateArticle (ctx) {
    let articleData = ctx.request.body
    articleData.modified = Date.now();
    const _id = objectId(articleData.id)
    let result = await article.findByIdAndUpdate(_id, articleData)
    if (result) {
      responseClient(ctx.response, 200, '0000', '文章更新成功')
    } else {
      responseClient(ctx.response, 200, '9999', '文章不存在')
    }
}

// 删除文章
async function deleteArticle(ctx, next) {
  let _id = objectId(ctx.params.id);
  const result = await article.findByIdAndRemove(_id).exec();
  await next();
  if (result) {
    responseClient(ctx.response, 200, "0000", "文章删除成功");
  } else if (!result) {
    responseClient(ctx.response, 200, "9999", "文章不存在");
  }
}

// 添加文章
async function addArticle(ctx, next) {
  await next();
  let newArticle = ctx.request.body;
  
  if (!newArticle.title) {
    return responseClient(ctx.response, 200, '9999', "文章添加失败：标题不能为空");
  }

  let result = await article.create(newArticle);
  if (result) {
    responseClient(ctx.response, 200, '0000', "文章添加成功");
  } else {
    responseClient(ctx.response, 200, '9999', "文章添加失败");
  }
}

async function getArticleDetail(ctx, next) {
  console.log(ctx.request.ip)
  await next();
  if (!/^[a-fA-F0-9]{24}$/.test(ctx.params.id)) {
    return responseClient(ctx.response, 200, "9999", "文章id 不合法");
  }
  let id = objectId(ctx.params.id);
  let result = await article.findById(id).exec();
  if (result) {
    result.update({
      accessed: Date.now,
      $inc: { traffic: 1 }
    }, { w: 1 }).exec();
    return responseClient(
      ctx.response,
      200,
      "0000",
      "文章详情查询成功",
      filterUselessData(result)
    );
  }
  return responseClient(ctx.response, 200, "9999", "找不到文章");
}

module.exports = {
  getArticles,
  getArticleDetail,
  deleteArticle,
  addArticle,
  updateArticle
};
