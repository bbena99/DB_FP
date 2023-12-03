const express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
var connect = require('../sqlConnect/Connection');
var mysqlConnection = connect.mysqlConnection
var headArray = connect.headArray
//var Userdb = require('../models/users');
//const {v4: uuidv4} = require('uuid');


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
  console.log(headArray)
  res.status(200).send(headArray)
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
  let sqlquery = 
  `SELECT * FROM ${query.userType}
    WHERE '${query.username}' = ${query.userType}.Username`
  mysqlConnection.query(sqlquery, (err, results, fields)=> {
    console.log(results); // results contains rows returned by server
    user = results[0]
    if(user==undefined)res.status(404).send("ERROR User not found in Database")
  
    //pw check
    let failed = !(user.password===query.password)
    if(failed){
      res.status(401).send(ERROR)
    }
  
    //double check user's values are specific
    console.log(user)
    
    //IMPORTANT: Must delete the password before returning the user's object back to the frontend for security!
    delete user.password
  
    //Send user back to frontend
    req.session.user=user
    next()
  })
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
  let user = undefined

  //Make the check query
  let sqlquery =
  `SELECT * FROM ${query.userType}
      WHERE Username = '${query.username}'`
  //debug console.log
  console.log("dbq1 = "+sqlquery)
  //query the db!
  mysqlConnection.query(sqlquery,(err, results, fields)=> {
    if(err)console.error(err)
    user = {...results}
    //debug console.log
    console.log("user after dpq1 : (Should be {})")
    console.log(user)
    //if username is taken, return an error
    if(user=={}){
      console.error("!!!Inside of if statement")
      res.status(401).send("User already exists")
    }
    
    //Make the insert query
    sqlquery = 
    `INSERT INTO ${query.userType} (Username, Password, FirstName, LastName)
      VALUES ('${query.username}', '${query.password}', '${query.firstname}', '${query.lastname}')`
    if(query.departmentId) sqlquery = 
    `INSERT INTO ${query.userType} (Username, Password, FirstName, LastName, DepartmentNumber, ReportsTo)
    VALUES ('${query.username}', '${query.password}', '${query.firstname}', '${query.lastname}', ${query.departmentId}, '${headArray[query.departmentId]}')`
    //Debug query
    console.log("dbq2 = "+sqlquery)
    //Insert to the db!
    mysqlConnection.query(sqlquery, (err, results, fields)=> {
      console.log(fields)
      if(err)console.error(err)

      sqlquery =
      `SELECT * FROM ${query.userType}
        WHERE Username = '${query.username}'`
      mysqlConnection.query(sqlquery, (err,results,fields)=>{
        //debug console.log that the user was made proper
        user = results[0]
        console.log("User after insert : ")
        console.log(user)
        
        //Send the data to the database here!
      
        //IMPORTANT: Must delete the password before returning the user's object back to the frontend for security!
        delete user.password
      
        //Return data to the frontend
        req.session.user=user
        next()
      })
    })
  })
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
 * @param {Session} req.session This is automatic
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