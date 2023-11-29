const mysql = require('mysql2');


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

module.exports = mysqlConnection