var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var {Client} = require('ssh2')
const sshClient = new Client()

var authRouter = require('./routes/auth')
var userRouter = require('./routes/user')
var classRouter = require('./routes/class')
var assignmentRouter = require('./routes/assignment')
var submissionsRouter = require('./routes/submission')

const dbServer = {
  host: "127.0.01",
  port: 3306,
  user: "wiesner5474",
  password: "h&UHukbS@x2W}DF ",
  database: "wiesner5474Project"
}

const tunnelConfig = {
  host: "138.49.184.47",
  port: 22,
  username: "wiesner5474",
  password: "106raay02324"
}

const forwardConfig = {
  srcHost: '127.0.0.1', // any valid address
  srcPort: 3306, // any valid port
  dstHost: dbServer.host, // destination database
  dstPort: dbServer.port // destination port
};

const SSHConnection = new Promise((resolve, reject) => {
  sshClient.on('ready', () => {
      sshClient.forwardOut(
      forwardConfig.srcHost,
      forwardConfig.srcPort,
      forwardConfig.dstHost,
      forwardConfig.dstPort,
      (err, stream) => {
           if (err) reject(err);
         
          // create a new DB server object including stream
          const updatedDbServer = {
               ...dbServer,
               stream
          };
          // connect to mysql
          const connection =  mysql.createConnection(updatedDbServer);
          // check for successful connection
         //  resolve or reject the Promise accordingly          
         connection.connect((error) => {
          if (error) {
              reject(error);
          }
          resolve(connection);
          });
     });
  }).connect(tunnelConfig);
});

/* CONNECTION FAILED
mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Connection Failed");
  }
});
*/

var app = express();

app.use(session({
  secret: 'flesh sucks',
  resave: false,
  saveUninitialized: true,
  cookie: {secure:false}
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));//need to change later

/**
 * Status code notes for Travywavy:
 * 200: successful endpoint hit and return (Level success)
 * 302: same hit/redundant (Level warning)
 * 402: Permission denied (Level miss)
 * 404: Recieved an endpoint, but that endpoint doesn't exist(Level miss)
 * 500: Server failure Method failed (Level fucked)
 * 502: Server Timed out (Level fucked)
 */
const api = '/api/v1';
app.use(api, authRouter); //used for authentication endpoints
app.use(api, userRouter); //used for nonauthentication user endpoints
app.use(api, classRouter) //used for classes endpoints
app.use(api, assignmentRouter) //used for assignment endpoints
app.use(api, submissionsRouter) //used for submission endpoints

// app.use('/**',(req,res,next)=>{
//   res.redirect("/");
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
