const jwt = require('jsonwebtoken')
const SECRET_KEY = 'awd'

module.exports = data => jwt.sign(data, SECRET_KEY)
