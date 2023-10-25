const TeacherModel = (sequelize, Sequelize) => {
  const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
  const Teacher = sequelize.define('User', {
      TId: {type: INTEGER, primaryKey: true, autoIncrement: true},
      Username: {type: STRING, primaryKey: true, allowNull: false},
      Password: STRING
  })
  return User
}

module.exports = TeacherModel