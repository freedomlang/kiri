const fs = require('fs');

function responseClient (res, httpCode = 500, code, message = '服务端异常', result = {}) {
    let responseData = {}
    responseData.code = code
    responseData.message = message
    res.status = httpCode
    // log.debug(__filename, __line(__filename), result)
    // if (result.token) res.set({'Authorization': result.token})
    if (result !== {}) responseData.result = result
    // log.debug(__filename, __line(__filename), responseData)
    res.body = JSON.stringify(responseData)
}

function checkDirExist(path2check) {
  if (!fs.existsSync(path2check)) {
    console.log(path2check)
    fs.mkdirSync(path2check);
  }
}

function checkAuthority(requestPath) {
    if (requestPath.indexOf('api/upload') >= 0) {
      return false;
    }

    return true;
}

function filterUselessData ({ id, modified, title, text, }) {
  return {
    id,
    modified,
    title,
    text
  }
}

module.exports = {
    responseClient,
    checkDirExist,
    checkAuthority,
    filterUselessData
}