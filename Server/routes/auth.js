const express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const TeacherModel = require('../schema/Teacher');
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
 * @param {String} req.query.type "Student"|"Teacher"
 * @param {String} req.query.username
 * @param {String} req.query.password
 * 
 * @returns {Student|Teacher} 
 */
router.post("/login", async (req,res,next) => {
    console.log("    .post('/login') was called proper")
    let query = req.query
    console.log(query)
    const ERROR = "Invalid credentials"
    let sqlquery = `SELECT * from ${req.query.type}`
    let user = {
      TId : 1,
      username:query.username,
      FirstName: "Big",
      LastName: "Chungus",
      DepartmentId: 0,
      ReportsTo: 0
    }
    console.log(user)
    req.session.user=user
    res.status(200).send(user)
    next()
});

/**
 * POST "/createUser"
 * Is used to create a new user
 */
router.post("/createUser", async (req,res) => {
    //console.log("    .post('/createUser') was called proper");
    //console.log(req.query);
    if(req.query=={}){
        res.status(400).send('NO QUERY FOUND');
        return;
    }
    /*if(await Userdb.findOne({'username':req.query.username})){
        res.status(408).send('USERNAME TAKEN');
        return;
    }*/
    //let encrypted = await bcrypt.hash(req.query.password,10);
    //let newUser = {'username' : req.query.username , 'password' : encrypted, 'admin': false, 'enabled' : true};
    //let dbUser = await Userdb.create( newUser );
    /*
    console.log("Before the for loop");
    for(let i=0; i<1200; i++){
        console.log(i);
        let name = uuidv4();
        let pw = await bcrypt.hash('123',10);
        let botUser = {
            'username' : name,
            'password' : pw,
            'admin' : false,
            'enabled' : true
        }
        await Userdb.create(botUser);
    }
    console.log("end of for loop");
    */
    req.session.regenerate((err)=>{
        if(err){
            console.log("Error in regenerate: "+err);
        }
        req.session.user = dbUser;
    });
    res.status(201).send(dbUser);
});

/**
 * POST "/logout"
 * Logs a user out
 */
router.post("/logout", (req, res) => {
    req.session.destroy( () => {
        //console.log( req.session );
        res.status(200).send({});
    });
});

/**
 * GET "/who"
 * Is used to validate user
 */
router.get("/who", (req,res,next)=>{
    //console.log("    GET '/who' was called")
    let result = req.session.user && req.session;
    //console.log(result);
    res.json( result );
});

/**
 * ALL "*"
 * Is used to validate user
 */
router.all( '*', (req,res,next)=>{
    console.log("    .all('*') was called")
    console.log(req.session)
    //console.log(req.query)
    if( req.session && req.session.user){
        //console.log("User found ☺");
        res.status(200).send(req.session.user)
    } else if( req.session ){
        req.session.regenerate( err => {
        console.log("No user found");
        //console.log(req.session);
        res.redirect("/");
        });
    } else {
        console.log("No session found");
        res.redirect("/");
    }
});

module.exports = router;