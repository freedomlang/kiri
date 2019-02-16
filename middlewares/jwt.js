var {responseClient, checkAuthority} = require('../utils')
var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = async function (ctx, next) {
    let path = ctx.request.path
    // log.debug(__filename, __line(__filename), 'path: ' + path)
    if (checkAuthority(path)) {
        return await next()
    } else {
        if (!ctx.header.authorization) {
            responseClient(ctx.response, 200, '0401', '请登录后再操作！');
        } else {
            try {
                const { id, user } = jwt.verify(ctx.header.authorization, config.jwt.cert);
                ctx.request.userId = id;
                await next();
                const newToken = jwt.sign({
                    id,
                    user
                }, config.jwt.cert, { expiresIn: 60 * 60 * 2 });
                ctx.response.set({'Authorization': newToken});
            } catch (err) {
                responseClient(ctx.response, 200, '0401', '请重新登录！');
            }
        }
    }
}