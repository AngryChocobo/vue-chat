const mysql = require('mysql')

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'chat',
}

const pool = mysql.createPool({
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
})

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
