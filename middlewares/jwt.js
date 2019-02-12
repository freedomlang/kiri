var {responseClient, checkAuthority} = require('../utils')
var jwt = require('jsonwebtoken');

module.exports = async function (ctx, next) {
    let path = ctx.request.path
    // log.debug(__filename, __line(__filename), 'path: ' + path)
    if (checkAuthority(path)) {
        return await next()
    } else {
        if (!ctx.header.authorization) {
            responseClient(ctx.response, 200, '9999', '请登录后再操作！')
            // ctx.res.end();
            // ctx.throw(401, JSON.stringify({
            //     code: '9999',
            //     message: '请登录后再操作！'
            // }));
        } else {
            jwt.verify(ctx.header.authorization, 'secret', async function (err, decoded) {
                if (err && err.name === 'TokenExpiredError') {
                    responseClient(ctx.response, 200, 3, '请重新登录！');
                } else {
                    await next();
                    const newToken = jwt.sign({
                        user: decoded.user
                    }, 'secret', { expiresIn: 60 * 60 * 2 });
                    ctx.response.set({'Authorization': newToken});
                }
            })
        }
    }
}