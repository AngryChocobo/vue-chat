const socketIO = require('socket.io')
const {
  Users,
  Friends,
  MakeFriendRecords,
  Messages,
  TalkLists,
} = require('./db/Models/index.js')

const query = require('./db/mysql.js')

// 获取会话列表 （同时查询新消息数量，插入到会话列表的数据结构中）
const getTalkList = (loggedInUserId, callback) => {
  console.log(`${loggedInUserId} 获取会话列表`)
  TalkLists.findAll({
    where: {
      userId: loggedInUserId,
    },
    include: [
      {model: Messages, as: 'lastMessageInfo'},
      {
        model: Users,
        attributes: {
          exclude: ['password'],
        },
        as: 'lastMessageUserInfo',
      },
      {
        model: Users,
        attributes: {
          exclude: ['password'],
        },
        as: 'targetUserInfo',
      },
    ],
  }).then(talkList => {
    callback(talkList)
  })
}
// 获取好友申请列表
const getFriendRequestList = (loggedInUserId, callback) => {
  console.log(`${loggedInUserId} 获取好友申请列表`)
  MakeFriendRecords.findAll({
    where: {
      targetUserId: loggedInUserId,
    },
    include: [{model: Users, as: 'makeRecordUserInfo'}],
    // todo 排序 先按read排序，后按时间排序
  }).then(callback)
}
// 获取好友列表
const getFriendList = (userId, callback) => {
  Friends.findAll({
    where: {
      userId,
    },
    include: {
      model: Users,
      as: 'friendUserInfo',
      attribute: {
        exclude: ['password'],
      },
    },
  }).then(callback)
}

module.exports = http => {
  // 私聊关系
  const talkRelationMap = []
  const io = socketIO(http)

  const getTargetOnlineSocket = targetId => {
    const target = talkRelationMap.find(
      talk => talk.userId === Number(targetId),
    )
    if (target) {
      const targetSocket = io.sockets.sockets[target.socketId]
      if (targetSocket) {
        return targetSocket
      }
    }
    return null
  }

  io.on('connection', function(socket) {
    // 每个用户都加入到私聊关系表中
    socket.on('connectSocketIO', function(userId) {
      // 存储登录用户的id
      console.log(`${userId} user connected, socketId： ${socket.id}`)
      socket.loggedInUserId = userId
      talkRelationMap.push({
        socketId: socket.id,
        userId: userId,
      })
    })

    // 发送消息
    socket.on('sendMessage', function(data) {
      console.log('server receive sendNewMessage')
      const {loggedInUserId} = socket
      const {targetId, message} = data
      Messages.create({
        fromUserId: loggedInUserId,
        targetUserId: targetId,
        message,
      }).then(newMessage => {
        // todo 返回新消息
        socket.emit('sendMessageSuccess', {
          targetUserId: targetId,
          message: newMessage,
        })
        // 更新自己的对话列表
        TalkLists.findOne({
          where: {
            userId: loggedInUserId,
            targetUserId: targetId,
          },
        }).then(talk => {
          if (talk) {
            // 修改
            talk
              .update({
                lastMessageUserId: loggedInUserId,
                lastMessageId: newMessage.id,
              })
              .then(() => {
                getTalkList(loggedInUserId, talkList => {
                  socket.emit('updateTalkList', talkList)
                })
              })
          } else {
            // 新增
            TalkLists.create({
              userId: loggedInUserId,
              targetUserId: targetId,
              lastMessageId: newMessage.id,
              lastMessageUserId: loggedInUserId,
            }).then(() => {
              getTalkList(loggedInUserId, talkList => {
                socket.emit('updateTalkList', talkList)
              })
            })
          }
        })
        // 更新对方的对话列表
        TalkLists.findOne({
          where: {
            userId: targetId,
            targetUserId: loggedInUserId,
          },
        }).then(talk => {
          if (talk) {
            // 修改
            talk
              .update({
                lastMessageUserId: targetId,
                lastMessageId: newMessage.id,
              })
              .then(() => {
                // 如果对方在线，更新对方的对话列表
                const targetToken = getTargetOnlineSocket(targetId)
                if (targetToken) {
                  getTalkList(targetId, talkList => {
                    targetToken.emit('updateTalkList', talkList)
                  })
                }
              })
          } else {
            // 新增
            TalkLists.create({
              userId: targetId,
              targetUserId: loggedInUserId,
              lastMessageId: newMessage.id,
              lastMessageUserId: loggedInUserId,
            }).then(() => {
              const targetToken = getTargetOnlineSocket(targetId)
              if (targetToken) {
                getTalkList(targetId, talkList => {
                  targetToken.emit('updateTalkList', talkList)
                })
              }
            })
          }
        })
      })
    })

    // 获取会话列表
    socket.on('getTalkList', () => {
      getTalkList(socket.loggedInUserId, results => {
        socket.emit('updateTalkList', results)
      })
    })

    // 获取好友列表
    socket.on('getUserFriendList', () => {
      getFriendList(socket.loggedInUserId, friends => {
        socket.emit('updateFriendList', friends)
      })
    })

    // 通过好友请求
    socket.on('agreeMakeFriendRequest', data => {
      const {targetUserId, recordId} = data
      const {loggedInUserId} = socket
      // 先查询该条记录是否已经被处理

      MakeFriendRecords.findOne({
        where: {
          id: recordId,
        },
      }).then(record => {
        if (!record) {
          socket.emit('agreeMakeFriendRequestFaild', '无效的好友请求记录')
        } else if (record.stats !== 'Waiting') {
          socket.emit('agreeMakeFriendRequestFaild', '好友请求记录已处理')
        } else {
          // todo 直接修改记录的那种api
          MakeFriendRecords.update(
            {stats: 'Agree'},
            {
              where: {
                id: recordId,
              },
            },
          ).then(updatedRecord => {
            console.log(`${loggedInUserId} 同意了好友请求id: ${recordId}`)
            socket.emit('agreeMakeFriendRequestSuccess', updatedRecord)
            // 更新自己的好友列表
            Friends.create({
              userId: loggedInUserId,
              friendId: targetUserId,
            }).then(() => {
              getFriendList(loggedInUserId, friends => {
                socket.emit('updateFriendList', friends)
              })
            })
            // 更新对方的好友列表
            Friends.create({
              userId: targetUserId,
              friendId: loggedInUserId,
            }).then(() => {
              // 检测对方是否在线，在线则刷新对方的好友列表
              const targetSocket = getTargetOnlineSocket(targetUserId)
              if (targetSocket) {
                getFriendList(targetUserId, friends => {
                  targetSocket.emit('updateFriendList', friends)
                })
              }
            })
          })
        }
      })
      // 对方可能也向当前用户发送了好友申请
      MakeFriendRecords.findOne({
        where: {
          fromUserId: targetUserId,
          targetUserId: loggedInUserId,
        },
      }).then(record => {
        if (record) {
          record.stats = 'Agree'
          MakeFriendRecords.save()
        }
      })
    })

    // 发出好友申请 (以及对方的推送)
    socket.on('makeFriendRequest', function(data) {
      console.log(
        `Receive makeFriendRequest from ${socket.loggedInUserId} to ${data.userId}`,
      )
      MakeFriendRecords.findOne({
        where: {
          fromUserId: socket.loggedInUserId,
          targetUserId: data.targetUserId,
          stats: 'Waiting',
        },
      }).then(record => {
        if (record) {
          socket.emit('makeFriendRequestResult', '已经发送过好友申请了')
        } else {
          MakeFriendRecords.create({
            fromUserId: socket.loggedInUserId,
            targetUserId: data.targetUserId,
            say: data.say,
            stats: 'Waiting',
          }).then(() => {
            socket.emit('makeFriendRequestResult', '好友请求发送成功')
            // 若对方在线则推送
            const targetSocket = getTargetOnlineSocket(data.targetUserId)
            if (targetSocket) {
              console.log('推送好友申请')
              targetSocket.emit('receiveFriendRequest')
            }
          })
        }
      })
    })

    // 获取好友申请列表
    socket.on('getFriendRequestList', function() {
      getFriendRequestList(socket.loggedInUserId, results => {
        socket.emit('getFriendRequestResult', results)
      })
    })

    // 清空对当前目标的消息未读数
    socket.on('clearUnReadMessages', targetId => {
      console.log(
        `${socket.loggedInUserId} 准备清空好友 ${targetId} 的未读消息数量`,
      )
      query(
        `update message set \`read\`=1 where fromUserId = ${targetId} and toUserId = ${socket.loggedInUserId};`,
        error => {
          if (error) {
            console.error(error)
          } else {
            getTalkList(socket.loggedInUserId, results => {
              socket.emit('updateTalkList', results)
            })
          }
        },
      )
    })

    // 清空当前用户的所有的好友请求未读数
    socket.on('clearUnReadFriendRequest', () => {
      console.log(`${socket.loggedInUserId} 准备清空好友请求的未读消息数量`)
      MakeFriendRecords.update(
        {
          read: true,
        },
        {
          where: {
            targetUserId: socket.loggedInUserId,
          },
        },
      ).then(() => {
        getFriendRequestList(socket.loggedInUserId, results => {
          socket.emit('getFriendRequestResult', results)
        })
      })
    })

    socket.on('disconnect', () => {
      const socketId = socket.id
      console.log(socketId + ' user disconnect')
      const removeIndex = talkRelationMap.findIndex(
        talk => talk.socketId === socketId,
      )
      if (removeIndex !== -1) {
        talkRelationMap.splice(removeIndex, 1)
      }
    })
  })
}
