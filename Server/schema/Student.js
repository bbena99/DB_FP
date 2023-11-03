const studentModel = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
    const Student = sequelize.define('Student', {
        Username: {type: STRING, primaryKey: true, allowNull: false, unique: true},
        FirstName: {type: STRING, allowNull: false},
        LastName: {type: STRING, allowNull: false},
        Password: {type: STRING, allowNull: false}
    })
    
    return Student
  }
  
  module.exports = StudentModel