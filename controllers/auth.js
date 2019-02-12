var user = require("../models/user.js");
var config = require('../config');
var jwt = require('jsonwebtoken');
var dayjs = require("dayjs");
var { responseClient } = require("../utils");
const bcrypt = require('bcrypt');
const saltRounds = 10;
// var to = require('await-to-js').default
// import log from '../log/log'

/**
 * 
 * 用户登录
 */
async function login(ctx, next) {
  let { username, password } = ctx.request.body || {};

  const [{ password: passwordHash }] = await user.find({ username })
  // log.debug(__filename, __line(__filename), pageNum)
  // log.debug(__filename, __line(__filename), result)
  // ctx.response.body = JSON.stringify(result)
  await next();

  const isMatch = await bcrypt.compare(password, passwordHash);

  // return bcrypt.compare(password, passwordHash, function(err, res) {
      // res == true
      if (isMatch) {
        const newToken = jwt.sign({
          username
        }, config.jwt.cert, { expiresIn: 60 * 60 * 2 });
        ctx.response.set({'Authorization': newToken});
        responseClient(ctx.response, 200, "0000", "登录成功");
      } else {
        responseClient(ctx.response, 200, '9999', '用户名或密码错误')
      }
  // });
}

module.exports = {
  login
};
