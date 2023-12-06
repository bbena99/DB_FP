const express = require('express');
const path = require('path');
const concat = require('concat-stream');
const { mysqlConnection } = require('../sqlConnect/Connection');

var router = express.Router();

/**
 * GET "/users"
 * @description Get a list of users. Will be used only for moderation purposes
 * 
 * @param {string?} req.query.userType Either 'Student' or 'Teacher'
 *  
 * @returns {Student[]|Teacher[]} Returns a list of users
 */
router.get('/users', async(req, res, next)=> {
  const userType = req.query.userType
  //console.log("    GET '/users' was called to get a list of all users");
  let returnUsers;
  let sqlquery =
  `SELECT * FROM '${userType}'`
  mysqlConnection.query(sqlquery, (err,results,fields)=>{
    if(err){
      console.error(err)
      res.status(404).send(err)
    }
    console.log(results)
    res.status(200).send(returnUsers);
  })
});


/**
 * PUT "/users/:username"
 * will disable a single user in the database
 * Will be used only for moderation purposes
 */
router.put('/users/:username', async (req,res,next)=>{
  //console.log("  PUT '/users/:username' called to disable/enable a user");
  let admin = req.session.user;
  //console.log(admin)
  if(!admin.admin)res.status(401).send("NOT AN ADMIN");
  //console.log("  PUT './users/:username was called to update a user");
  //let dbUser = await Userdb.findOne({"username":req.params.username});
  //dbUser.enabled = req.body.enabled;
  //await Userdb.updateOne({'username':req.params.username},dbUser);
  res.status(200).send(dbUser);
});

module.exports = router;