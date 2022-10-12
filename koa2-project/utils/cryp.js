// 2.5 utils/cryp.js
const crypto = require('crypto')
const { SECRET_KEY } = require('../conf/constants')

function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

function genPassword (passsword) {
  const str = `password=${passsword}&key=${SECRET_KEY}`
  return md5(str)
}

module.exports = {
  genPassword
}