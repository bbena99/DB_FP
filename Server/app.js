var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql = require('mysql');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');

/**
 * Will need to add a connection to the DB here.
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
app.use(express.static(path.join(__dirname, 'public')));//need to change later

const api = '/api/v1';
app.use(api, authRouter); //used for authentication endpoints
app.use(api, userRouter); //used for nonauthentication user endpoints

app.use('/**',(req,res,next)=>{
  res.redirect("/");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
