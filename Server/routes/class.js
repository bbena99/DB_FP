const express = require('express');
var router = express.Router();

//Start of variables to use

//Start of endpoints
/**
 * POST "/Users/:username/Classes"
 * @description Creates a class for the teacher
 * 
 * @param req.params.username username of teacher making the class
 * @param req.body.class a class object
 * 
 * @returns {undefined}
 */
router.post("/Users/:username/Classes", (req,res,next)=>{
  //Get params
  const username = req.params.username
  let newClass = req.body.class

  //Debug console.logs
  console.log(`  POST to "/User/:username/Classes" was called
  Username : ${username}
  Class :
  `)
  console.log(newClass)

  //Check if teacher Return status(401) if not

  //Make query to make class

  //Return status(200)
})

/**
 * GET "/Users/:username/Classes"
 * @description Get a list of all classes for a user
 * 
 * @param req.param.username
 * 
 * @returns {Class[]}
 */
router.get("/Users/:username/Classes", (req,res,next)=>{
  //Get params
  const username = req.params.username
  let returnClasses

  //Debug console.logs
  console.log(`   GET to "/Users/:username/Classes" was called proper
  Username`)

  // query the db for class[] and store in "returnClasses"
})
//Export the router
module.exports = router;