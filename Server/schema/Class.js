const classModel = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
    const Class = sequelize.define('Class', {
        ClassName: {type: STRING, primaryKey: true, allowNull: false},
        Department: {type: STRING, primaryKey: true, allowNull: false},
        CourseNumber: {type: INTEGER, primaryKey: true, allowNull: false},
        Section: {type: INTEGER, primaryKey: true, allowNull: false},
    })
    
    return Class
  }
  
  module.exports = ClassModel