const jwt = require('jsonwebtoken')
const {Users} = require('../db/Models/index.js')
const SECRET_KEY = 'awd'

// 判断登陆状态 中间件
module.exports = (req, res, next) => {
  const token = String(req.headers.authorization)
    .split(' ')
    .pop()
  // 解析出用户的id
  jwt.verify(token, SECRET_KEY, (jwtError, data) => {
    if (jwtError) {
      res.status(401).send(jwtError.message)
    } else {
      // 判断有没有这个用户
      Users.findOne({
        where: {
          id: data.id,
        },
      }).then(loggedInUser => {
        if (!loggedInUser) {
          res.status(401).send('登陆失效')
        } else {
          req.loggedInUser = loggedInUser
          next()
        }
      })
    }
  })
}
