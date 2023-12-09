const express = require('express');
var router = express.Router();

//Start of variables to use

//Start of endpoints
/**
 * ALL "/Users/:Username/Classes/:ClassId/Assignments"
 * @description debug endpoint
 */
router.all('Users/:Username/Classes/:ClassId/Assignments',(req,res,next)=>{
  let un = req.params.Username
  let cid = req.params.ClassId
  console.log(`Inside Users/:Username/Classes/:ClassId with url:
  Users/${un}/Classes/:${cid}/Assignments`)
  next()
})

/**
 * POST "/Users/:Username/Classes/:ClassId/Assignments"
 * @description A teacher is making a new Assignment
 * 
 * @param req.param.Tid id of the teacher making the assignment
 * @param req.query.classId id of the class that is making the assignment
 * 
 * @param req.body.assignment an assignment object
*/
router.post("/Users/:username/Classes/:classId/Assignments",(req,res,next)=>{
  const params = req.params
  const body = req.body
  console.log(body)

  //Check for valid teacher and teacher teaches this class
  //You will actually have to query the db for this value
  if(params.username==undefined)res.status(401).send("Invalid user tried to make an Assignment")

  console.log(params)
  console.log(body)

  //Make creation query here:
  let sqlquery =
  ``
  //Don't need to send anything back to frontend.
  res.status(200).send()
})

/**
 * GET "/Assignments"
 * @description Get all assignments for a given class
 * 
 * @param req.params.username username of the user
 * @param req.params.classId id of the class that has the assignments
 * 
 * @returns {Assignment[]}
*/
router.get("/Users/:username/Classes/:classId/Assignments",(req,res,next)=>{
  const params = req.params
})

/**
 * GET "/Assignments/:assignmentId"
 * @description Get a single assignment
 * 
 * @param req.params.username username of person
 * @param req.params.classId id of the class
 * @param req.params.assignmentId for the id of the assignment
 * 
 * @returns {Assignment}
*/
router.get("/User/:username/Classes/:classId/Assignments/:assignmentId",(req,res,next)=>{
  let id = req.params.assignmentId
})

//Export the router
module.exports = router;