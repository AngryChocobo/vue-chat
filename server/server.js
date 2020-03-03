const mysql = require('mysql')
const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')

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

// 跨域
app.use(cors())

// 私聊关系
const talkRelationMap = []

io.on('connection', function(socket) {
  console.log(socket.id + ' user connected')
  // 每个用户都加入到私聊关系表中
  socket.on('login', function(userId) {
    talkRelationMap.push({
      socketId: socket.id,
      userId,
    })
  })
  socket.on('sendMessage', function(data) {
    console.log('server receive sendNewMessage: ', data)
    const {fromUserId, toUserId, message} = data
    const connection = mysql.createConnection(mysqlConfig)
    const sendDate = Date.now()
    connection.connect()
    connection.query(
      `INSERT INTO message (fromUserId, toUserId, message, sendDate) VALUES (${fromUserId}, ${toUserId}, '${message}', ${sendDate})`,
      function(error, result, fields) {
        if (error) throw error
        console.log('服务器已记录本次消息')
        socket.emit('sendMessageSuccess', {id: result.insertId})
        // 判断当前消息的接收方在不在线，在线则推送
        const toUser = talkRelationMap.find(talk => talk.userId === toUserId)
        if (toUser) {
          const toUserSocket = io.sockets.sockets[toUser.socketId]
          toUserSocket.emit('receiveMessage', {
            id: result.insertId,
            fromUserId,
            toUserId,
            message,
            sendDate,
          })
        }
      },
    )
  })
  socket.on('disconnect', () => {
    console.log('a user disconnect')
  })
})

// 聊天对话页
app.get('/getTalkViewDetail', function(req, res) {
  const {fromUserId, toUserId} = req.query
  const connection = mysql.createConnection(mysqlConfig)

  connection.connect()
  connection.query(
    `select u.*, m.message, m.sendDate, m.fromUserId from message m left JOIN user u ON m.fromUserId=u.id LEFT JOIN user u2 ON m.toUserId=u2.id where (m.fromUserId=${fromUserId} and m.toUserId=${toUserId} ) or (m.fromUserId=${toUserId} and m.toUserId=${fromUserId} ) order by m.sendDate`,
    function(error, results, fields) {
      if (error) throw error
      res.send(results)
      //   connection.end()
    },
  )
})

// 发送新消息
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

// 好友列表
app.get('/getUserFriendList', function(req, res) {
  const {userId} = req.query
  const connection = mysql.createConnection(mysqlConfig)

  connection.connect()
  connection.query(
    `select friend.id, friendId, friend.create_at, username, src from friend,user where friend.userId=user.id and friend.isRequest=0 and friend.friendId=${userId}`,
    function(error, results, fields) {
      if (error) throw error
      res.send(results)
      //   connection.end()
    },
  )
})

http.listen(8888, function() {
  console.log('server is running at 8888')
})
