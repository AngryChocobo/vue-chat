const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const query = require('./db/mysql.js')
const SECRET_KEY = 'awd'

require('./socket.io.js')(http)

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
      query(
        `select id, username, nickname, src from user where id = ${data.id}`,
        (error, result) => {
          if (error || result.length === 0) {
            res.status(401).send('登陆失效')
          } else {
            req.user = result[0]
            next()
          }
        },
      )
    }
  })
}

app.get('/', function(req, res) {
  res.send('server ok')
})

app.get('/init', (req, res) => {
  query(`insert into test (id) values (1)`)
  res.send('init success')
})

app.get('/deleteAllData', (req, res) => {
  query(`delete from friend`, error => {
    if (error) throw error
    query(`delete from user`, error => {
      if (error) throw error
      query(`delete from makeFriendRecord`, error => {
        if (error) throw error
        query(`delete from message`, error => {
          if (error) throw error
          query(`delete from talkList`, error => {
            if (error) throw error
            res.send('looks delete success')
          })
        })
      })
    })
  })
})

// 查看搜索用户详细信息及是否是好友
app.get('/getUserInfo', authMiddleWare, (req, res) => {
  const targetId = req.query.userId // 查询目标id
  const loggedInUserId = req.user.id
  query(
    `select friend.id as friendRelationId, friendRemark, friend.create_at as beFriendDate, makeFriendRecord.stats, makeFriendRecord.create_at as recordSendDate,  user.id as userId, username, nickname, src, say
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

// 查看好友请求详细信息
app.get('/getFriendRequestInfo', authMiddleWare, (req, res) => {
  const userId = req.query.userId // 查询目标id
  const loggedInUserId = req.user.id
  query(
    `select makeFriendRecord.id, user.id as userId, user.username, user.nickname, user.src, 
  makeFriendRecord.say, makeFriendRecord.stats, makeFriendRecord.read, makeFriendRecord.create_at
  from makeFriendRecord 
  left join user on user.id = makeFriendRecord.fromUserId
  where toUserId = ${loggedInUserId} and user.id = ${userId}
  order by makeFriendRecord.read asc, makeFriendRecord.create_at desc`,
    (error, results) => {
      if (error) throw error
      res.send(results[0])
    },
  )
})

// 同意好友请求
app.post('/agreeMakeFriendRequest', authMiddleWare, (req, res) => {
  const {userId, recordId} = req.body
  const loggedInUserId = req.user.id
  console.log(`${loggedInUserId} 同意了好友请求id: ${recordId}`)
  query(
    `update makeFriendRecord set stats = 1 where id = ${recordId}`,
    error => {
      if (error) {
        res.status(500).send('通过失败')
      } else {
        const now = Date.now()
        query(
          `insert into friend (userId, friendId, create_at) values (${userId}, ${loggedInUserId}, ${now})`,
          error => {
            if (error) {
              res.status(500).send('添加好友失败')
            } else {
              query(
                `insert into friend (userId, friendId, create_at) values (${loggedInUserId}, ${userId}, ${now})`,
                error => {
                  if (error) {
                    res.status(500).send('添加好友失败')
                  } else {
                    res.send('')
                  }
                },
              )
            }
          },
        )
      }
    },
  )
})

// 会话目标信息
app.get('/getTalkTargetInfo', authMiddleWare, function(req, res) {
  const {userId} = req.query
  query(
    `select id, username, nickname, src from user WHERE user.id=${userId}`,
    function(error, results) {
      if (error) throw error
      res.send(results[0])
    },
  )
})

// 会话页
app.get('/getMessageList', authMiddleWare, function(req, res) {
  const {fromUserId, toUserId} = req.query
  query(
    `select m.* from message m left JOIN user u ON m.fromUserId=u.id LEFT JOIN user u2 ON m.toUserId=u2.id where (m.fromUserId=${fromUserId} and m.toUserId=${toUserId} ) or (m.fromUserId=${toUserId} and m.toUserId=${fromUserId} ) order by m.sendDate`,
    function(error, results) {
      if (error) throw error
      res.send({targetId: toUserId, messageList: results})
    },
  )
})

// 好友列表
app.get('/getUserFriendList', authMiddleWare, (req, res) => {
  const {userId} = req.query
  query(
    `select friend.userId, friend.create_at, username, src from friend,user where friend.userId=user.id and friend.friendId=${userId}`,
    function(error, results) {
      if (error) throw error
      res.send(results)
    },
  )
})

// 搜索用户
app.get('/searchUsers', authMiddleWare, (req, res) => {
  const {keyword} = req.query
  query(
    `select id, username, nickname, src from user where user.username like '%${keyword}%' or user.id='${keyword}'`,
    function(error, results) {
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
