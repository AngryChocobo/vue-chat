const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const {Op} = require('sequelize')
const middleWares = require('./middleWares/index.js')
const {authMiddleWare} = middleWares
const utils = require('./utils/index.js')
const {generateToken} = utils

const {
  Users,
  MakeFriendRecords,
  Friends,
  Messages,
} = require('./db/Models/index.js')

const app = express()

const initApp = () => {
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: false}))

  // parse application/json
  app.use(bodyParser.json())

  // 跨域
  app.use(cors())
}

initApp()

const INVALID_USERNAME = '用户名未注册'
const INVALID_USERNAME_CODE = 422

const INVALID_PASSWORD = '密码错误'
const INVALID_PASSWORD_CODE = 422

app.get('/', function(req, res) {
  // res.send('server ok')
  Friends.findAll({
    include: [
      {model: Users, as: 'userInfo'},
      {model: Users, as: 'friendUserInfo'},
    ],
  }).then(friends => {
    res.send(friends)
  })
})

app.get('/ss', function(req, res) {
  MakeFriendRecords.findAll().then(data => {
    res.send(data)
  })
})

// 注册
app.post('/register', function(req, res) {
  const {username, password} = req.body
  Users.findOne({
    where: {
      username,
    },
  }).then(user => {
    if (user) {
      console.log('重复注册: ', username)
      res.status(500).send('该用户名已被占用')
    } else {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      Users.create({
        username,
        nickname: username,
        password: hashedPassword,
      }).then(user => {
        console.log('新注册用户: ' + JSON.stringify(user))
        res.send('注册成功')
      })
    }
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

// 修改昵称
app.post('/confirmNickName', authMiddleWare, (req, res) => {
  const {nickname} = req.body
  console.log(req.body)
  const loggedInUserId = req.loggedInUser.id
  Users.update(
    {
      nickname,
    },
    {
      where: {
        id: {
          [Op.eq]: loggedInUserId,
        },
      },
    },
  ).then(() => {
    // 重新获取用户信息，并返回
    Users.findOne({
      attributes: {
        exclude: ['password'],
      },
      where: {
        id: loggedInUserId,
      },
    }).then(user => {
      res.send(user)
    })
  })
})

// 修改头像
app.post('/confirmAvatar', authMiddleWare, (req, res) => {
  const {avatar} = req.body
  console.log(req.body)
  const loggedInUserId = req.loggedInUser.id
  Users.update(
    {
      avatar,
    },
    {
      where: {
        id: {
          [Op.eq]: loggedInUserId,
        },
      },
    },
  ).then(() => {
    // 重新获取用户信息，并返回
    Users.findOne({
      attributes: {
        exclude: ['password'],
      },
      where: {
        id: loggedInUserId,
      },
    }).then(user => {
      res.send(user)
    })
  })
})

// 查看搜索用户详细信息及是否是好友
app.get('/getUserInfo', authMiddleWare, (req, res) => {
  const {targetUserId} = req.query // 查询目标id
  const loggedInUserId = req.loggedInUser.id
  Users.findOne({
    attributes: {
      exclude: ['password'],
    },
    where: {
      id: targetUserId,
    },
  }).then(user => {
    if (!user) {
      res.status(500).send('无效的用户id')
    } else {
      // 查询该用户与自己的好友状态、好友申请状态
      Friends.findOne({
        where: {
          userId: loggedInUserId,
          friendId: targetUserId,
        },
      }).then(friend => {
        // 存在好友关系，则为用户对象添加好友关系信息（备注等）
        // TODO Refactor 想更好地实现办法
        if (friend) {
          user.dataValues.friendRelation = friend
          console.log('查看了好友的用户信息: ', JSON.stringify(user, null, 4))
          res.send(user.dataValues)
        } else {
          // 故意冗余，以便前端判断
          user.dataValues.friendRelation = null
          // 查找是否曾向对方发送过好友申请
          MakeFriendRecords.findOne({
            attributes: {
              exclude: ['read'],
            },
            where: {
              fromUserId: loggedInUserId,
              targetUserId,
              stats: 'Waiting',
            },
          }).then(record => {
            user.dataValues.makeFriendRecord = record
            if (record) {
              console.log(
                '查看了曾申请过好友的用户信息: ',
                JSON.stringify(user, null, 4),
              )
            } else {
              console.log('查看了用户信息: ', JSON.stringify(user, null, 4))
            }
            res.send(user.dataValues)
          })
        }
      })
    }
  })
})

// 查看好友请求详细信息
app.get('/getFriendRequestInfo', authMiddleWare, (req, res) => {
  const userId = req.query.userId // 查询目标id
  MakeFriendRecords.findOne({
    where: {
      fromUserId: userId,
    },
    include: [
      {
        model: Users,
        as: 'makeRecordUserInfo',
        attributes: {
          exclude: ['password'],
        },
      },
    ],
  }).then(record => {
    if (record) {
      res.send(record)
    } else {
      res.status(500).send('无效的数据')
    }
  })
})

// 同意好友请求
app.post('/agreeMakeFriendRequest', authMiddleWare, (req, res) => {
  const {userId, recordId} = req.body
  const loggedInUserId = req.loggedInUser.id
  // 先查询该条记录是否已经被处理
  MakeFriendRecords.findOne({
    where: {
      recordId,
    },
  }).then(record => {
    if (!record) {
      res.status(500).send('无效的好友请求记录')
    } else if (record.stats !== 'Waiting') {
      res.status(500).send('好友请求记录已处理')
    } else {
      MakeFriendRecords.update(
        {stats: 'Agree'},
        {
          where: {
            recordId,
          },
        },
      ).then(updatedRecord => {
        console.log(`${loggedInUserId} 同意了好友请求id: ${recordId}`)
        res.send(updatedRecord)
        // 更新自己的好友列表
        Friends.insert({
          userId: loggedInUserId,
          friendId: userId,
        }).then(() => {
          res.send('成功添加对方为好友')
        })
        // 更新对方的好友列表
        Friends.insert({
          userId,
          friendId: loggedInUserId,
        }).then(() => {
          // 检测对方是否在线，在线则刷新对方的好友列表
        })
      })
    }
  })
})

// 会话目标信息
app.get('/getTalkTargetInfo', authMiddleWare, function(req, res) {
  const {userId} = req.query
  Users.findOne({
    where: {
      id: userId,
    },
    attributes: {
      exclude: ['password'],
    },
  }).then(userInfo => {
    if (!userInfo) {
      res.status(500).send('无效的用户id')
    } else {
      res.send(userInfo)
    }
  })
})

// 会话页
app.get('/getMessageList', authMiddleWare, function(req, res) {
  const {fromUserId, targetId} = req.query
  Messages.findAll({
    where: {
      [Op.or]: [
        {
          fromUserId: fromUserId,
          targetUserId: targetId,
        },
        {
          fromUserId: targetId,
          targetUserId: fromUserId,
        },
      ],
    },
    order: [['createdAt', 'ASC']],
  }).then(messages => {
    res.send({targetId: targetId, messageList: messages})
  })
})

// 好友列表
app.get('/getUserFriendList', authMiddleWare, (req, res) => {
  const loggedInUserId = req.loggedInUser.id
  Friends.findAll({
    where: {
      userId: loggedInUserId,
    },
    include: [
      {
        model: Users,
        as: 'friendUserInfo',
        attributes: {
          exclude: ['password'],
        },
      },
    ],
  }).then(friendList => {
    res.send(friendList)
  })
})

module.exports = app
