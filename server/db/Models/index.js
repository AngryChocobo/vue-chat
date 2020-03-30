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

module.exports = {
  Users,
  Friends,
  Messages,
  MakeFriendRecords,
  TalkLists,
}
