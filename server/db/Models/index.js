const Friends = require('./Friends.js')
const Users = require('./Users.js')
const Messages = require('./Messages.js')
const MakeFriendRecords = require('./MakeFriendRecords.js')
const TalkLists = require('./TalkLists.js')

Friends.belongsTo(Users, {foreignKey: 'userId', as: 'userInfo'})
Friends.belongsTo(Users, {foreignKey: 'friendId', as: 'friendUserInfo'})

MakeFriendRecords.belongsTo(Users, {
  foreignKey: 'fromUserId',
  as: 'makeRecordUserInfo',
})
MakeFriendRecords.belongsTo(Users, {
  foreignKey: 'targetUserId',
  as: 'requestRecordUserInfo',
})

Messages.belongsTo(Users, {
  foreignKey: 'fromUserId',
  as: 'sendMessageUserInfo',
})

Messages.belongsTo(Users, {
  foreignKey: 'targetUserId',
  as: 'receiveMessageUserInfo',
})

TalkLists.belongsTo(Messages, {
  foreignKey: 'lastMessageId',
  as: 'lastMessageInfo',
})

TalkLists.belongsTo(Users, {
  foreignKey: 'lastMessageUserId',
  as: 'lastMessageUserInfo',
})

TalkLists.belongsTo(Users, {
  foreignKey: 'targetUserId',
  as: 'targetUserInfo',
})

module.exports = {
  Users,
  Friends,
  Messages,
  MakeFriendRecords,
  TalkLists,
}
