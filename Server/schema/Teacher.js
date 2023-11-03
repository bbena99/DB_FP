const TeacherModel = (sequelize, Sequelize) => {
  const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
  const Teacher = sequelize.define('Teacher', {
      TId: {type: INTEGER, primaryKey: true, autoIncrement: true, unique: true},
      Username: {type: STRING, primaryKey: true, allowNull: false, unique: true},
      Password: {type: STRING, allowNull: false},
      FirstName: {type: STRING, allowNull: false},
      LastName: {type: STRING, allowNull: false},
      DepartmentId: {type: INTEGER, allowNull: false},
      ReportsTo: {type: INTEGER},

  })

  Teacher.belongsTo(Teacher, { as: 'Supervisor', foreignKey: 'ReportsTo'});

  Teacher.hasMany(Teacher, { as: 'Subordinates', foreignKey: 'ReportsTo'});
  
  return Teacher
}

module.exports = TeacherModel