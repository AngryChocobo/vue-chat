const Sequelize = require('Sequelize')
const sequelize = require('../sequelize.js')

class TalkLists extends Sequelize.Model {}

TalkLists.init(
  {
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
  },
  {sequelize, modelName: 'newTalkLists'},
)

// TalkLists.sync({force: true})
module.exports = TalkLists
