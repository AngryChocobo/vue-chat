const Friends = require('./Friends.js')
const Users = require('./Users.js')
const Messages = require('./Messages.js')
const MakeFriendRecords = require('./MakeFriendRecords.js')
const TalkLists = require('./TalkLists.js')
const sequelize = require('../sequelize.js')
// Friends.belongsTo(Users, {foreignKey: 'userId', as: 'userInfo'})
// Friends.belongsTo(Users, {foreignKey: 'friendId', as: 'friendUserInfo'})

Friends.sync({force: true}).then(() => {
  Users.sync({force: true}).then(() => {
    Users.create({
      username: 'A',
      password: '$2b$10$hdEqRYOzbd16jzUtwkEYP.JHJZRdvpia/DUcGZpaMHixl82FzqZvO',
    }).then(user => {
      Users.create({
        username: 'B',
        password:
          '$2b$10$hdEqRYOzbd16jzUtwkEYP.JHJZRdvpia/DUcGZpaMHixl82FzqZvO',
      }).then(user => {
        Users.create({
          username: 'C',
          password:
            '$2b$10$hdEqRYOzbd16jzUtwkEYP.JHJZRdvpia/DUcGZpaMHixl82FzqZvO',
        }).then(user => {
          Friends.create({
            userId: 1,
            friendId: 2,
          })
        })
      })
    })
  })
})
