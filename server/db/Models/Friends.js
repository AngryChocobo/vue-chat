const Sequelize = require('Sequelize')
const sequelize = require('../sequelize.js')

class Friends extends Sequelize.Model {}

Friends.init(
  {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    friendId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    friendRemark: {
      type: Sequelize.STRING,
    },
    createDate: {
      type: Sequelize.DATE,
    },
  },
  {sequelize, modelName: 'newFriends'},
)

// Friends.sync({force: true})
module.exports = Friends
