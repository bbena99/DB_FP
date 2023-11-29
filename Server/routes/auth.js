const express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
var mysqlConnection = require('../sqlConnect/Connection');
//var Userdb = require('../models/users');
//const {v4: uuidv4} = require('uuid');

var departmentHead = [ //Used in handleTeacher() below
  0, //CS head Tid = 0
  4, //MTH head Tid = 4
  2, //ENG head Tid = 2
  3, //BIO head Tid = 3
  1, //IS head Tid = 1
]

/*
Example of a query:

Router.get("/", (req, res) => {
  let query = "SELECT * FROM quarterback_rankings"
  mysqlConnection.query(
    query,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        console.log(err);
      }
    }
  );
});
*/

/*
example of return from "SELECT * FROM Teacher"
Teacher = {
  TId: Number,
  Username: String,
  Password: Bcrypt Hash,
  FirstName: String,
  LastName: String,
  DepartmentId: Number,
  ReportsTo: Number
}
*/

/*
example of return from "SELECT * FROM Teacher JOIN Department"
Teacher X Department = {
  TId: Number,
  Username: String,
  Password: Bcrypt Hash,
  FirstName: String,
  LastName: String,
  DepartmentId: Number,
  <department attr>
  ReportsTo: Number
}
*/

/*
example of return from "SELECT TId,FirstName,LastName FROM Teacher"
Teacher = {
  TId: Number,
  FirstName: String,
  LastName: String
}
*/


/**
 * GET "/test"
 * @description A test endpoint for Travywavy
 * 
 * @param {JSON} req.params
 * @param {JSON} req.body
 * @param {JSON} req.query
 * 
 * @returns {JSON}
 */
router.get("/test",(req,res)=>{
    //by hitting '.' it gives you special commands indicated by a star. These are the important ones
    console.log("GET/api/v1/test was called with req.params:")
    console.log(req.params)
    console.log(req.body)
    console.log(req.query)
    console.log("And res:")
    //console.log(res)
    console.log("End of GET/api/v1/test!")
    //tl:dr, these are big objects with a lot of data that you typically don't want to log out.
})


/**
 * POST "/login"
 * @description Is used to login an existing user.
 * 
 * @param {String} req.query.userType "Student"|"Teacher"
 * @param {String} req.query.username
 * @param {String} req.query.password
 * 
 * @returns {Student|Teacher} 
 */
router.post("/Login", async (req,res,next) => {
  //parse the frontend data sent.
  console.log("-->.post('/Login') was called proper")
  let query = req.query
  console.log(query)
  const ERROR = "Invalid credentials"
  let user
  //Make query for Sql
  let sqlquery = undefined
  mysqlConnection.query(
  `SELECT * FROM ${query.userType}
                  WHERE ${query.username} = Username`,
                  function(err, results, fields) {
                    console.log(results); // results contains rows returned by server
                    let returnResults = results
                    console.log(fields); // fields contains extra meta data about results, if available
                  }
)
  if(user==undefined)res.status(404).send("ERROR User not found in Database")
  //pw check
  user.password==query.password
  if(failed)res.status(401).send(ERROR)
  

  //This object will be replaced with the obj returned from the db parse.
  user = {
    username:query.username,
    password:query.password,
    FirstName: 'Big',
    LastName: 'Chungus',
  }
  if(query.userType=='Teacher'){
    user.TId=0
    user.DepartmentId=0
  } else {
    user.SId=0
  }

  //double check user's values are specific
  console.log(user)
  
  //IMPORTANT: Must delete the password before returning the user's object back to the frontend for security!
  delete user.password

  //Send user back to frontend
  req.session.user=user
  next()
});


/**
 * POST "/CreateUser"
 * @description Is used to login an existing user.
 * 
 * @param {String} req.query.type "Student"|"Teacher"
 * @param {String} req.query.username
 * @param {String} req.query.password
 * @param {String} req.query.firstname
 * @param {String} req.query.lastname
 * @param {Number} req.query.departmentId
 *  
 * @returns {Student|Teacher} 
 */
router.post("/CreateUser", async (req,res,next) => {
  //Parse the frontend data sent.
  console.log("-->.post('/CreateUser') was called proper")
  let query = req.query
  console.log(query)
  //This object will be replaced with the obj returned from the db parse.
  let user = {
    username:query.username,
    password:query.password,
    FirstName: query.firstname,
    LastName: query.lastname,
  }
mysqlConnection.query(
  `SELECT * FROM ${query.userType}
                  WHERE Username == ${query.username}`,
                  function(err, results, fields) {
                    console.log(results); // results contains rows returned by server
                    let returnResults = results
                    console.log(fields); // fields contains extra meta data about results, if available
                  }
)
  if(!user){
    mysqlConnection.query(
    `INSERT INTO ${query.userType} (Username, Password, FirstName, LastName)
    VALUES (${query.username}, ${query.password}, ${query.firstname}, ${query.lastname})`,
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      user  = results
      console.log(fields); // fields contains extra meta data about results, if available
    }
)
               }

  //double check user's values are specific
  console.log("dbuser : ")
  console.log(user)
  
  //Send the data to the database here!

  //IMPORTANT: Must delete the password before returning the user's object back to the frontend for security!
  delete user.password

  //Return data to the frontend
  req.session.user=user
  next()
});

/**
 * POST "/logout"
 * @description Logs out the current User
 * 
 * @param {undefined} //no input params
 * 
 * @returns {undefined} //returns undefined to frontend
 */
router.post("/logout", (req, res) => {
  console.log("Inside of /logout in auth.js")
  req.session.destroy( () => {
    //console.log( req.session );
    res.status(200).send({});
  });
});


/**
 * GET "/who"
 * @description Checks the current logged in user based on session for frontend validation
 * 
 * @param {any} req.session This is automatic
 * 
 * @returns {Student|Teacher} //returns the current student|teacher logged in.
 */
router.get("/who", (req,res,next)=>{
    //console.log("    GET '/who' was called")
    let result = req.session.user && req.session;
    //console.log(result);
    res.json( result );
});

/**
 * ALL "*"
 * @description Is used to validate user/session
 * 
 * @param {any} req.session this is automatic
 * 
 * @returns {Student|Teacher} returns the student|teacher in the session object.
 */
router.all( '*', (req,res,next)=>{
    //console.log("    .all('*') was called")
    //console.log(req.session)
    //console.log(req.query)
    if( req.session && req.session.user){
        //console.log("User found ☺");
        res.status(200).send(req.session.user)
    } else if( req.session ){
        req.session.regenerate( err => {
        //console.log("No user found");
        //console.log(req.session);
        res.redirect("/");
        });
    } else {
        //console.log("No session found");
        res.redirect("/");
    }
});

module.exports = router;