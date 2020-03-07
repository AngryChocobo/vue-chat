const mysql = require('mysql')
const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')

const passwordEncryption = (password) => {
  const bcrypt = require('bcrypt')
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

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
  socket.on('connectSocketIO', function(userId) {
    talkRelationMap.push({
      socketId: socket.id,
      userId,
    })
    // socket.emit('receiveMessage', {fuck: 'yes'})
  })
  socket.on('sendMessage', function(data) {
    console.log('server receive sendNewMessage')
    const {fromUserId, toUserId, message} = data
    const connection = mysql.createConnection(mysqlConfig)
    const sendDate = Date.now()
    connection.connect()
    connection.query(
      `INSERT INTO message (fromUserId, toUserId, message, sendDate) VALUES (${fromUserId}, ${toUserId}, '${message}', ${sendDate})`,
      function(error, result, fields) {
        if (error) throw error
        socket.emit('sendMessageSuccess', {id: result.insertId, sendDate})
        // 判断当前消息的接收方在不在线，在线则推送
        console.log('准备推送', talkRelationMap)
        const toUser = talkRelationMap.find(talk => talk.userId === toUserId)
        if (toUser) {
          const toUserSocket = io.sockets.sockets[toUser.socketId]
          if (toUserSocket) {
            toUserSocket.emit('receiveMessage', {
              id: result.insertId,
              fromUserId,
              toUserId,
              message,
              sendDate,
            })
          }
        }
      },
    )
  })
  socket.on('disconnect', () => {
    const socketId = socket.id
    console.log(socketId + ' user disconnect')
    talkRelationMap.splice(
      talkRelationMap.findIndex(talk => talk.socketId === socketId),
      1,
    )
  })

  socket.on('reconnect', function(socket) {
    console.log(socket.id + ' is reconnect')
  })

  socket.on('reconnect_attempt', function(socket) {
    console.log(socket.id + ' is reconnect attempt')
  })

  socket.on('reconnecting', function(socket) {
    console.log(socket.id + ' is reconnecting')
  })
})

app.get('/', function(req, res) {
  res.send('server ok')
})

// 会话目标信息

app.get('/getTalkTargetInfo', function(req, res) {
  const {userId} = req.query
  const connection = mysql.createConnection(mysqlConfig)

  connection.connect()
  connection.query(`select * from user WHERE user.id=${userId}`, function(
    error,
    results,
  ) {
    if (error) throw error
    res.send(results[0])
  })
})

// 会话页
app.get('/getMessageList', function(req, res) {
  const {fromUserId, toUserId} = req.query
  const connection = mysql.createConnection(mysqlConfig)

  connection.connect()
  connection.query(
    `select m.* from message m left JOIN user u ON m.fromUserId=u.id LEFT JOIN user u2 ON m.toUserId=u2.id where (m.fromUserId=${fromUserId} and m.toUserId=${toUserId} ) or (m.fromUserId=${toUserId} and m.toUserId=${fromUserId} ) order by m.sendDate`,
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

// 搜索用户
app.get('/searchUsers', function(req, res) {
  const {fromUserId, keyword} = req.query
  const connection = mysql.createConnection(mysqlConfig)

  connection.connect()
  connection.query(
    `select * from user where user.username like '%${keyword}%' or user.id='${keyword}'`,
    function(error, results) {
      if (error) throw error
      res.send(results)
      //   connection.end()
    },
  )
})

// 会话列表页
app.get('/getTalkList', function(req, res) {
  const {userId} = req.query
  const connection = mysql.createConnection(mysqlConfig)

  connection.connect()
  connection.query(
    `select talkList.id, toUserId, u1.username as lastMessageUserName, message.message, u2.username as toUserName, u2.src, sendDate 
    from talkList 
    left join message on
    message.id = lastMessageId
    left join user u1 on 
    u1.id = lastMessageUserId
    left join user u2 on
    u2.id = toUserId
    where talkList.userId = ${userId}`,
    function(error, results, fields) {
      if (error) throw error
      res.send(results)
      //   connection.end()
    },
  )
})

// 注册
app.post('/register', function(req, res) {
  const {username, password} = req.body
  const connection = mysql.createConnection(mysqlConfig)
  const hashedPassword = passwordEncryption(password)
  const now = Date.now()
  connection.connect()
  connection.query(
    `insert into user (username, password, create_at) values 
    ('${username}', '${hashedPassword}', ${now}) `,
    function(error, result) {
      if (error) {
        console.error(error)
        res.status(500)
        switch (error.sqlState) {
          case '23000': 
            res.send(error.sqlMessage)
            break
            default: 
              res.send('未知错误')
              break
        }
      } else {
        res.send(result)
      }
    },
  )
})

http.listen(3000, function() {
  console.log('server is running at 3000')
})
