const Sequelize = require('Sequelize')
const sequelize = require('../sequelize.js')

class MakeFriendRecords extends Sequelize.Model {}

MakeFriendRecords.init(
  {
    fromUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    targetUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    say: {
      type: Sequelize.STRING,
    },
    read: {
      type: Sequelize.BOOLEAN,
    },
    stats: {
      type: Sequelize.ENUM('Waiting', 'Agree', 'Disagree'),
    },
    createDate: {
      type: Sequelize.DATE,
    },
  },
  {sequelize, modelName: 'newMakeFriendRecords'},
)

// MakeFriendRecords.sync({force: true})
module.exports = MakeFriendRecords
