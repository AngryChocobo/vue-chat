const Friends = require('./Friends.js')
const Users = require('./Users.js')
const Messages = require('./Messages.js')
const MakeFriendRecords = require('./MakeFriendRecords.js')
const TalkLists = require('./TalkLists.js')

Friends.belongsTo(Users, {foreignKey: 'userId', as: 'UserInfo'})
Friends.belongsTo(Users, {foreignKey: 'friendId', as: 'FriendUserInfo'})

MakeFriendRecords.belongsTo(Users, {
  foreignKey: 'fromUserId',
  as: 'MakeRecordUserInfo',
})
MakeFriendRecords.belongsTo(Users, {
  foreignKey: 'targetUserId',
  as: 'ReceiveRecordUserInfo',
})

module.exports = {
  Users,
  Friends,
  Messages,
  MakeFriendRecords,
  TalkLists,
}
