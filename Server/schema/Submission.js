const submissionModel = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
    const Submission = sequelize.define('Submission', {
        SubmissionId: {type: STRING, primaryKey: true, allowNull: false},
        Comments: {type: STRING, allowNull: true},
        Points: {type: INTEGER, allowNull: false},
        SubmissionStatus: {type: STRING, allowNull: false},
        SubmissionDate: {type: DATE, allowNull: false}
    })
    
    return Submission
  }
  
  module.exports = SubmissionModel