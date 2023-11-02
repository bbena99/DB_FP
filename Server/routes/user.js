const express = require('express');
const path = require('path');
const concat = require('concat-stream');

var router = express.Router();

/**
 * GET "/users"
 * get a list of users
 * can have a filter to filter out certain users.
 * Will be used only for moderation purposes
 */
router.get('/users', async(req, res, next)=> {
  //console.log("    GET '/users' was called to get a list of all users");
  let returnUsers;
  //console.log(req.query.filter);
  //if(req.query.username!='undefined')returnUsers = await Userdb.find({'username':{$regex:req.query.username}});
  //else returnUsers = await Userdb.find();
  res.status(200).send(returnUsers);
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