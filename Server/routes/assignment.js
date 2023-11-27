const express = require('express');
var router = express.Router();

//Start of variables to use

//Start of endpoints

/**
 * POST "/Assignments"
 * @description A teacher is making a new Assignment
 * 
 * @param req.query.Tid id of the teacher making the assignment
 * @param req.query.classId id of the class that is making the assignment
 * 
 * @param req.body.Name is the name of the assignment
 * @param req.body.Description is the discription of the the assignment
 * @param req.body.FileType is an array of file types accepted for this assignment's submissions
 * @param req.body.TotalPoints is the total allowable points for this assignment
 * @param req.body.Visibility is if the assignment is to be hidden for later ;)
 * @param req.body.dueDate is a string of the due date of the assignment
*/
router.post("/Assignments",(req,res,next)=>{
  const query = req.query
  const body = req.body

  //Check for valid teacher and teacher teaches this class
  //You will actually have to query the db for this value
  if(query.Tid==undefined)res.status(401).send("Invalid user tried to make an Assignment")

  console.log(query)
  console.log(body)

  //Make creation query here:

  //Don't need to send anything back to frontend.
  res.status(200).send()
})

/**
 * GET "/Assignments"
 * @description Get all assignments for a given class
 * 
 * @param req.query.classId id of the class we need all assignments for.
 * 
 * @returns {Assignment[]}
*/
router.get("Assignments",(req,res,next)=>{
  const query = req.query
})

/**
 * GET "/Assignments/:assignmentId"
 * @description Get a single assignment
 * 
 * @param req.params.assignmentId for the id of the assignment
 * 
 * @returns {Assignment}
*/
router.get("/Assignments/:assignmentId",(req,res,next)=>{
  let id = req.params.assignmentId
})

//Export the router
module.exports = router;