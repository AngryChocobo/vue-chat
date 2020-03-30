const Sequelize = require('Sequelize')
const sequelize = require('./db/sequelize.js')
const {Model} = Sequelize

const test1 = () => {
  const Person = sequelize.define('person', {
    name: {
      type: Sequelize.STRING,
    },
  })

  const Msg = sequelize.define('msg', {
    message: {
      type: Sequelize.STRING,
    },
  })

  const Class = sequelize.define('class', {
    // monitor: {
    //   type: Sequelize.INTEGER,
    //   // references: {
    //   //   model: Person,
    //   //   key: 'id',
    //   // },
    // },
    // teacher: {
    //   type: Sequelize.INTEGER,
    //   // references: {
    //   //   model: Person,
    //   //   key: 'id',
    //   // },
    // },
    some: {
      type: Sequelize.STRING,
      defaultValue: 'ass',
    },
  })

  Class.belongsTo(Person, {
    foreignKey: 'monitor',
    as: 'monitorData',
  })

  Class.belongsTo(Person, {
    foreignKey: 'teacher',
    as: 'teacherData',
  })

  Class.belongsTo(Msg, {
    foreignKey: 'msgId',
    as: 'messageData',
  })

  sequelize.sync({force: true}).then(() => {
    Person.create({
      id: 100,
      name: '王小明',
    }).then(() => {
      Person.create({
        id: 200,
        name: '李狗蛋',
      }).then(() => {
        Person.create({
          name: '欧阳老师',
        }).then(() => {
          Msg.create({
            msg: 'hello',
          }).then(() => {
            Class.create({
              monitor: 100,
              teacher: 200,
              msgId: 1,
              // myStudentId1: 2,
            }).then(() => {
              Class.findAll({
                include: [
                  {
                    model: Person,
                    // attributes: {
                    //   exclude: ['name'],
                    // },
                    as: 'monitorData',
                  },
                  {
                    model: Person,
                    // attributes: {
                    //   exclude: ['name'],
                    // },
                    as: 'teacherData',
                  },
                  {model: Msg, as: 'messageData'},
                ],
                // where: {
                //   monitor: 1,
                // },
              }).then(res => {
                console.log('Class' + JSON.stringify(res, null, 4))
              })
              // Person.findAll({
              //   //   include: [
              //   //     {
              //   //       model: Class,
              //   //       // as: 'ass1',
              //   //     },
              //   //     {
              //   //       model: Person,
              //   //       as: 'ass2',
              //   //     },
              //   //   ],
              // }).then(res => {
              //   console.log('Person :' + JSON.stringify(res, null, 4))
              // })
            })
          })
        })
      })
    })
  })
}

const mainTest = () => {
  // const Users = require('./db/Models/Users')
  // const Friends = require('./db/Models/Friends')

  const Friends = sequelize.define('newFriends', {
    // userId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // },
    // friendId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // },
    friendRemark: {
      type: Sequelize.STRING,
    },
  })
  // class Friends extends Model {}
  // Friends.init(
  //   {
  //     // userId: {
  //     //   type: Sequelize.INTEGER,
  //     //   allowNull: false,
  //     // },
  //     // friendId: {
  //     //   type: Sequelize.INTEGER,
  //     //   allowNull: false,
  //     // },
  //     friendRemark: {
  //       type: Sequelize.STRING,
  //     },
  //   },
  //   {sequelize, modelName: 'newFriends'},
  // )
  const Users = sequelize.define('newUsers', {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    nickname: {
      type: Sequelize.STRING,
    },
    src: {
      type: Sequelize.STRING,
    },
  })

  Friends.belongsTo(Users, {foreignKey: 'userId', as: 'userInfo'})
  Friends.belongsTo(Users, {foreignKey: 'friendId', as: 'friendUserInfo'})

  sequelize.sync({force: true}).then(() => {
    Users.create({
      username: '哪吒',
    }).then(() => {
      Users.create({
        username: '敖丙',
      }).then(() => {
        Friends.create({
          userId: 1,
          friendId: 2,
        }).then(() => {
          Friends.findAll({include: [{model: Users, as: 'userInfo'}]}).then(
            res => {
              console.log('Friends: ' + JSON.stringify(res, null, 4))
            },
          )
        })
      })
    })
  })
}

mainTest()
