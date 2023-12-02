const mysql = require('mysql2');

var headArray = []

mysqlConnection = mysql.createConnection({
  host: "138.49.184.47",
  user: "wiesner5474",
  database: "wiesner5474Project",
  password: "Spidahman616!",
  multipleStatements: true,
});

// Test connection
mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Connection Failed");
    throw err
  }
});
var query =
`SELECT *
  FROM Teacher
  WHERE Teacher.ReportsTo IS NULL`
mysqlConnection.query(query,(err,results,fields)=>{
  results.map((r,index)=>{
    headArray[index]=r.Username
  })
})
module.exports = {mysqlConnection, headArray}