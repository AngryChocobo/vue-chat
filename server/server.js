const mysql = require('mysql')

var express = require('express')
var bodyParser = require('body-parser')

var app = express()
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'chat',
}
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

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
  const connection = mysql.createConnection(mysqlConfig)

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

app.post('/sendNewMessage', function(req, res) {
  const {fromUserId, toUserId, message} = req.body
  const connection = mysql.createConnection(mysqlConfig)
  const now = Date.now()
  connection.connect()
  connection.query(
    `INSERT INTO message (fromUserId, toUserId, message, sendDate) VALUES (${fromUserId}, ${toUserId}, '${message}', ${now})`,
    function(error, result) {
      if (error) throw error
      res.send(result)
    },
  )
})

app.listen(8888, function() {
  console.log('server is running at 8888')
})
