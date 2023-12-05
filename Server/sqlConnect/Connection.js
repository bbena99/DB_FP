const mysql = require('mysql2');
require('dotenv').config()

headArray = []

mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
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
  //console.log(results)
  results.map((r,index)=>{
    headArray[index]="'"+r.Username+"'"
  })
})
module.exports = {mysqlConnection, headArray}