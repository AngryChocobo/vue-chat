const mysql = require('mysql')

var express = require('express')

var app = express()

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
  )
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

  if (req.method == 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

app.get('/getTalkViewDetail', function(req, res) {
  const {fromUserId, toUserId} = req.query
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'chat',
  })

  connection.connect()
  connection.query(
    `select u.*, m.message from message m left JOIN user u ON m.fromUserId=u.id LEFT JOIN user u2 ON m.toUserId=u2.id where (m.fromUserId=${fromUserId} and m.toUserId=${toUserId} ) or (m.fromUserId=${toUserId} and m.toUserId=${fromUserId} )`,
    function(error, results, fields) {
      if (error) throw error
      res.send(results)
      //   connection.end()
    },
  )
})

app.listen(8888, function() {
  console.log('server is running at 8888')
})
