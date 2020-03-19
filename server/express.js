const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const {Op} = require('sequelize')
const middleWares = require('./middleWares/index.js')
const {authMiddleWare} = middleWares
const utils = require('./utils/index.js')
const {generateToken} = utils

const {Users, MakeFriendRecords, Friends} = require('./db/Models/index.js')
const query = require('./db/mysql.js')

const app = express()

const INVALID_USERNAME = '用户名未注册'
const INVALID_USERNAME_CODE = 422

const INVALID_PASSWORD = '密码错误'
const INVALID_PASSWORD_CODE = 422

const initApp = () => {
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: false}))

  // parse application/json
  app.use(bodyParser.json())

  // 跨域
  app.use(cors())
}

const testApi = () => {
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
}

initApp()
testApi()

app.get('/', function(req, res) {
  res.send('server ok')
})

app.get('/ss', function(req, res) {
  MakeFriendRecords.findAll().then(data => {
    res.send(data)
  })
})

// 注册
app.post('/register', function(req, res) {
  const {username, password} = req.body
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  Users.create({username, password: hashedPassword}).then(user => {
    console.log('新注册用户: ' + JSON.stringify(user))
    res.send('注册成功')
  })
})

// // 登陆
app.post('/login', function(req, res) {
  const {username, password} = req.body
  Users.findOne({
    where: {
      username,
    },
  }).then(loggedInUser => {
    if (!loggedInUser) {
      res.status(INVALID_USERNAME_CODE).send(INVALID_USERNAME)
    } else {
      if (bcrypt.compareSync(password, loggedInUser.password)) {
        // 生成token
        const token = generateToken({
          id: loggedInUser.id,
        })
        // 删除用户密码等敏感信息
        loggedInUser.password = null
        res.send({
          loggedInUser,
          token,
        })
      } else {
        res.status(INVALID_PASSWORD_CODE).send(INVALID_PASSWORD)
      }
    }
  })
})

// 搜索用户
app.get('/searchUsers', authMiddleWare, (req, res) => {
  const {keyword} = req.query
  const loggedInUserId = req.loggedInUser.id

  Users.findAll({
    attributes: {
      exclude: ['password'],
    },
    where: {
      username: {
        [Op.substring]: keyword,
      },
      id: {
        [Op.ne]: loggedInUserId,
      },
    },
  }).then(users => {
    res.send(users)
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
  const {fromUserId, targetId} = req.query
  query(
    `select m.* from message m left JOIN user u ON m.fromUserId=u.id LEFT JOIN user u2 ON m.toUserId=u2.id where (m.fromUserId=${fromUserId} and m.toUserId=${targetId} ) or (m.fromUserId=${targetId} and m.toUserId=${fromUserId} ) order by m.sendDate`,
    function(error, results) {
      if (error) throw error
      res.send({targetId: targetId, messageList: results})
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

module.exports = app
