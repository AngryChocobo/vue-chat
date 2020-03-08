const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const query = require('./db/mysql.js')
const SECRET_KEY = 'awd'

const passwordEncryption = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// 跨域
app.use(cors())

// 判断登陆状态 中间件
const authMiddleWare = (req, res, next) => {
  const token = String(req.headers.authorization)
    .split(' ')
    .pop()
  // 解析出用户的id
  jwt.verify(token, SECRET_KEY, (jwtError, data) => {
    if (jwtError) {
      res.status(401).send(jwtError.message)
    } else {
      // 判断有没有这个用户
      query(`select * from user where id = ${data.id}`, (error, result) => {
        if (error || result.length === 0) {
          res.status(401).send('登陆失效')
        } else {
          req.user = result[0]
          next()
        }
      })
    }
  })
}

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
  })
  socket.on('sendMessage', function(data) {
    console.log('server receive sendNewMessage')
    const {fromUserId, toUserId, message} = data
    const sendDate = Date.now()
    query(
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
})

app.get('/', function(req, res) {
  res.send('server ok')
})

// 查看搜索用户详细信息及是否是好友
app.get('/getUserInfo', authMiddleWare, (req, res) => {
  const targetId = req.query.userId // 查询目标id
  const loggedInUserId = req.user.id
  query(
    `select friend.id as friendRelationId, friendRemark, friend.create_at as beFriendDate, makeFriendRecord.stats, makeFriendRecord.create_at as recordSendDate,  user.id as userId, username, nickname, src
  from user 
  left join friend 
  on friend.friendId = ${loggedInUserId} and friend.userId = ${targetId}
  left join makeFriendRecord
  on makeFriendRecord.fromUserId = ${loggedInUserId} and makeFriendRecord.toUserId = ${targetId}
  where
  user.id = ${targetId}`,
    (error, results) => {
      if (error) throw error
      res.send(results[0])
    },
  )
})

// 会话目标信息
app.get('/getTalkTargetInfo', authMiddleWare, function(req, res) {
  const {userId} = req.query
  query(`select * from user WHERE user.id=${userId}`, function(error, results) {
    if (error) throw error
    res.send(results[0])
  })
})

// 会话页
app.get('/getMessageList', authMiddleWare, function(req, res) {
  const {fromUserId, toUserId} = req.query
  query(
    `select m.* from message m left JOIN user u ON m.fromUserId=u.id LEFT JOIN user u2 ON m.toUserId=u2.id where (m.fromUserId=${fromUserId} and m.toUserId=${toUserId} ) or (m.fromUserId=${toUserId} and m.toUserId=${fromUserId} ) order by m.sendDate`,
    function(error, results, fields) {
      if (error) throw error
      res.send(results)
    },
  )
})

// 发送新消息
app.post('/sendNewMessage', authMiddleWare, function(req, res) {
  const {fromUserId, toUserId, message} = req.body
  const now = Date.now()
  query(
    `INSERT INTO message (fromUserId, toUserId, message, sendDate) VALUES (${fromUserId}, ${toUserId}, '${message}', ${now})`,
    function(error, result) {
      if (error) throw error
      res.send(result)
    },
  )
})

// 好友列表
app.get('/getUserFriendList', authMiddleWare, (req, res) => {
  const {userId} = req.query
  query(
    `select friend.id, friendId, friend.create_at, username, src from friend,user where friend.userId=user.id and friend.friendId=${userId}`,
    function(error, results, fields) {
      if (error) throw error
      res.send(results)
    },
  )
})

// 搜索用户
app.get('/searchUsers', authMiddleWare, (req, res) => {
  const {fromUserId, keyword} = req.query
  query(
    `select * from user where user.username like '%${keyword}%' or user.id='${keyword}'`,
    function(error, results) {
      if (error) throw error
      res.send(results)
    },
  )
})

// 会话列表页
app.get('/getTalkList', authMiddleWare, function(req, res) {
  const {userId} = req.query
  query(
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
    },
  )
})

// 注册
app.post('/register', function(req, res) {
  const {username, password} = req.body
  const hashedPassword = passwordEncryption(password)
  const now = Date.now()
  query(
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

// // 登陆
app.post('/login', function(req, res) {
  const {username, password} = req.body
  query(`select * from user where username = '${username}'`, function(
    error,
    result,
  ) {
    if (error) {
      throw error
    } else if (result.length == 0) {
      return res.status(422).send({message: '用户名不存在'})
    } else {
      const user = result[0]
      if (bcrypt.compareSync(password, user.password)) {
        const userDate = Object.assign({}, user)
        // 不返回用户的密码
        delete userDate.password
        // 生成token
        const token = require('jsonwebtoken').sign(
          {
            id: userDate.id,
          },
          SECRET_KEY,
        )
        res.send({
          user: userDate,
          token,
        })
      } else {
        return res.status(422).send('密码不正确')
      }
    }
  })
})

app.get('/profile', (req, res) => {
  const token = String(req.headers.authorization)
    .split(' ')
    .pop()
  // 解析出用户的id
  jwt.verify(token, SECRET_KEY, (err, data) => {
    if (err) {
      res.status(401).send(err.message)
    } else {
      //判断有没有这个用户
      query(`select * from user where id = ${data.id}`, function(
        error,
        result,
      ) {
        if (error || result.length === 0) {
          res.status(401).send('登陆失效')
        } else {
          res.send('有')
        }
      })
    }
  })
})

http.listen(3000, function() {
  console.log('server is running at 3000')
})
