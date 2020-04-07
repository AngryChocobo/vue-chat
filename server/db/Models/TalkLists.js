const Sequelize = require('Sequelize')
const sequelize = require('../sequelize.js')

const TalkLists = sequelize.define('talkLists', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  targetUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lastMessageUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lastMessageId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
})

// TalkLists.sync({force: true})
module.exports = TalkLists
