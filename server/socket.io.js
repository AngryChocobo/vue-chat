const socketIO = require('socket.io')
const query = require('./db/mysql.js')

// 获取会话列表 （同时查询新消息数量，插入到会话列表的数据结构中）
const getTalkList = (loggedInUserId, callback) => {
  console.log(`${loggedInUserId} 获取会话列表`)
  query(
    `select  talkList.id,targetUser.id as targetUserId, lastMessageUserId, targetUser.username as targetUserName, lastMessageUser.username as lastMessageUserName, message.message, targetUser.src, message.sendDate
      from talkList
      left join user lastMessageUser on lastMessageUser.id = talkList.lastMessageUserId
      left join user targetUser on targetUser.id =  talkList.targetId
      left join message on message.id = talkList.lastMessageId
      where talkList.userId = ${loggedInUserId}`,
    function(error, results) {
      if (error) throw error
      query(
        `select fromUserId, toUserId, count(fromUserId) as unReadCount from message
        where message.read = 0  and toUserId = ${loggedInUserId}
        GROUP BY fromUserId, toUserId`,
        (error, unReadResults) => {
          if (error) throw error
          unReadResults.forEach(data => {
            const item = results.find(v => v.targetUserId === data.fromUserId)
            item.unReadCount = data.unReadCount
          })
          callback(results)
        },
      )
    },
  )
}

module.exports = http => {
  // 私聊关系
  const talkRelationMap = []
  const io = socketIO(http)

  io.on('connection', function(socket) {
    // 每个用户都加入到私聊关系表中
    socket.on('connectSocketIO', function(userId) {
      // 存储登录用户的id
      console.log(`${userId} user connected, socketId： ${socket.id}`)
      socket.loggedInUserId = userId
      talkRelationMap.push({
        socketId: socket.id,
        userId: String(userId),
      })
    })

    // 发送消息
    socket.on('sendMessage', function(data) {
      console.log('server receive sendNewMessage')
      const {loggedInUserId} = socket
      const {toUserId, message} = data
      const sendDate = Date.now()
      query(
        `INSERT INTO message (fromUserId, toUserId, message, sendDate) VALUES (${loggedInUserId}, ${toUserId}, '${message}', ${sendDate})`,
        (error, result) => {
          if (error) {
            throw error
          } else {
            const {insertId} = result
            // todo 重构 插入之前先判断，有则更新
            query(
              `select * from talkList
                where userId = ${loggedInUserId} and targetId = ${toUserId}`,
              (error, results) => {
                const newMessage = {
                  id: insertId,
                  fromUserId: loggedInUserId,
                  toUserId,
                  message,
                  sendDate,
                }
                const pushMessageTo = () => {
                  console.log('准备推送', talkRelationMap)
                  const toUser = talkRelationMap.find(
                    talk => talk.userId === toUserId,
                  )
                  if (toUser) {
                    const toUserSocket = io.sockets.sockets[toUser.socketId]
                    if (toUserSocket) {
                      toUserSocket.emit('receiveMessage', newMessage)
                      getTalkList(toUserSocket.loggedInUserId, results => {
                        console.log('will')
                        toUserSocket.emit('updateTalkList', results)
                      })
                    }
                  }
                }
                const createTargetNewTalkRecord = () => {
                  query(
                    `select * from talkList
                      where userId = ${toUserId} and targetId = ${loggedInUserId}`,
                    (error, results) => {
                      if (error) {
                        throw error
                      } else if (results.length > 0) {
                        // 更新该记录
                        query(
                          `UPDATE talkList set lastMessageId=${insertId}, lastMessageUserId=${loggedInUserId}, userId=${toUserId}, targetId=${loggedInUserId} where id = ${results[0].id}`,
                          error => {
                            if (error) {
                              throw error
                            } else {
                              pushMessageTo()
                            }
                          },
                        )
                      } else {
                        // 插入新记录
                        query(
                          `insert into talkList (lastMessageId, lastMessageUserId, userId, targetId) values (${insertId}, ${loggedInUserId}, ${toUserId}, ${loggedInUserId})`,
                          error => {
                            if (error) {
                              throw error
                            } else {
                              pushMessageTo()
                            }
                          },
                        )
                      }
                    },
                  )
                }

                if (error) {
                  throw error
                } else if (results.length > 0) {
                  // 更新该记录
                  query(
                    `UPDATE talkList set lastMessageId=${insertId}, lastMessageUserId=${loggedInUserId}, userId=${loggedInUserId}, targetId=${toUserId} where id = ${results[0].id}`,
                    error => {
                      if (error) {
                        throw error
                      } else {
                        socket.emit('sendMessageSuccess', {
                          id: insertId,
                          sendDate,
                        })
                        createTargetNewTalkRecord()
                      }
                    },
                  )
                } else {
                  // 插入新记录
                  query(
                    `insert into talkList (lastMessageId, lastMessageUserId, userId, targetId) values (${insertId}, ${loggedInUserId}, ${loggedInUserId}, ${toUserId})`,
                    error => {
                      if (error) {
                        throw error
                      } else {
                        socket.emit('sendMessageSuccess', {
                          id: insertId,
                          sendDate,
                        })
                        createTargetNewTalkRecord()
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

    // 获取会话列表
    socket.on('getTalkList', () => {
      getTalkList(socket.loggedInUserId, results => {
        socket.emit('updateTalkList', results)
      })
    })

    // 发出好友申请
    socket.on('makeFriendRequest', function(data) {
      console.log(
        `Receive makeFriendRequest from ${socket.loggedInUserId} to ${data.userId}`,
      )
      query(
        `insert into makeFriendRecord (fromUserId, toUserId, say, create_at) VALUES 
      (${socket.loggedInUserId}, ${data.userId}, '${data.say}', ${Date.now()})`,
        error => {
          if (error) {
            socket.emit('makeFriendRequestResult', '发送失败')
          } else {
            socket.emit('makeFriendRequestResult', '发送成功')
          }
        },
      )
    })

    // 获取好友申请列表
    socket.on('getFriendRequestList', function() {
      console.log(`${socket.loggedInUserId} 获取好友申请列表`)
      query(
        `select makeFriendRecord.id, user.id as userId, user.username, user.nickname, user.src, 
          makeFriendRecord.say, makeFriendRecord.stats, makeFriendRecord.read, makeFriendRecord.create_at
          from makeFriendRecord 
          left join user on user.id = makeFriendRecord.fromUserId
          where toUserId = ${socket.loggedInUserId}
          order by makeFriendRecord.read asc, makeFriendRecord.create_at desc`,
        (error, results) => {
          if (error) {
            socket.emit('getFriendRequestResult', '发送失败')
          } else {
            socket.emit('getFriendRequestResult', results)
          }
        },
      )
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
