const express = require('express');
var router = express.Router();

//Start of variables to use

//Start of endpoints
/**
 * ALL "/Users/:Username/Classes"
 */
router.all("/",(req,res,next)=>{
  console.log('-->Inside of class.js')
  console.log(req.url)
  next()
})
/**
 * POST "/Users/:Username/Classes"
 * @description Creates a class for the teacher
 * 
 * @param req.params.Username username of teacher making the class
 * @param req.body.class a class object
 * 
 * @returns {undefined}
 */
router.post("/", (req,res,next)=>{
  //Get params
  const username = req.params.Username
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
router.get("/", (req,res,next)=>{
  //Get params
  const username = req.params.username
  let returnClasses

  let sqlquery =
  `SELECT * 
      FROM Student JOIN TAKES
      ON Student.Username = TAKES.Username
      JOIN Class
      ON TAKES.CourseNumber = Class.CourseNumber
      ON TAKES.Department = Class.Department
      ON TAKES.SectionNumber = Class.SectionNumber
      WHERE Student.Username = ${username}`

  //Debug console.logs
  console.log(`   GET to "/Users/:username/Classes" was called proper
  Username`)

  // query the db for class[] and store in "returnClasses"
})
//Export the router
module.exports = router;