const mysql = require('mysql')
const mysqlConfig = require('./mysqlConfig.js')

const password = process.env.sqlPassword
console.log('数据库密码：' + password)

const pool = mysql.createPool(mysqlConfig)

const query = (sql, callback) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('连接似乎错误')
        resolve(err)
      } else {
        connection.query(sql, (err, rows) => {
          callback(err, rows)
          connection.release()
        })
      }
    })
  })
}

module.exports = query
