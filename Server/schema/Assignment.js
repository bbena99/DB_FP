const AssignmentModel = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
    const Assignment = sequelize.define('Assignment', {
        AssignmentId: {type: INTEGER, primaryKey: true, autoIncrement: true, unique: true},
        Name: {type: STRING, allowNull: false},
        Description: {type: STRING, allowNull: true},
        FileType: {type: STRING, allowNull: false},
        TotalPoints: {type: INTEGER, allowNull: false},
        Visibility: {type: BOOLEAN, allowNull: false},
        DueDate: {type: DATE, allowNull: false}
  
    })
    
    return Assignment
  }
  
  module.exports = AssignmentModel