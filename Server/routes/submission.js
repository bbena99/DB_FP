const express = require('express');
const { mysqlConnection } = require('../sqlConnect/Connection');
var router = express.Router();

//Start of variables to use

//Start of endpoints
/**
 * ALL "/Users/:username/Classes/:classId/Assignments/:assignId/Submissions"
 * @description Debugger for submission.js
 * 
 * @param req.params.username username of the user
 * @param req.params.classId id of the class that has the assignments
 * @param req.params.assignId id of the assignment that has the submissions
*/
router.all("/Users/:username/Classes/:classId/Assignments/:assignId",(req,res,next)=>{
  console.log("submission.js is entered sucessfully ☺")
  console.log(req.params)
  next()
})
/**
 * GET "/Users/:username/Classes/:classId/Assignments/:assignId"
 * @description Get all Submissions for a given Assignment
 * 
 * @param req.params.username username of the user
 * @param req.params.classId id of the class that has the assignments
 * @param req.params.assignId id of the assignment that has the submissions
 * @param req.query.userType type of user getting submissions "Student"|"Teacher"
 * 
 * @returns {Submission[]}
*/
router.get("/Users/:username/Classes/:classId/Assignments/:assignId/Submissions",(req,res,next)=>{
  const params = req.params
  const classId = params.classId.split('~')
  const userType = req.query.userType

  //sqlquery here
  let sqlquery =
  `INSERT`
})
/**
 * POST "/Users/:username/Classes/:classId/Assignments/:assignId"
 * @description Make new Submission
 * 
 * @param req.params.username username of the user
 * @param req.params.classId id of the class that has the assignments
 * @param req.params.assignId id of the assignment that has the submissions
 * @param req.body newSubmission
 * 
 * @returns {Submission[]}
*/
router.post("/Users/:username/Classes/:classId/Assignments/:assignId/Submissions",(req,res,next)=>{
  const params = req.params
  const classId = params.classId.split('~')
  const newSubmission = req.body

  //sqlquery here
  let sqlquery =
  `SELECT * FROM Submissions JOINS SUBMITSTO
    ON Submissions.SubmissionID = SUBMITSTO.SubmissionID
    AND SUBMITSTO.AssignmentID = '${params.assignId}'`
  mysqlConnection.query(sqlquery,(err,results,fields)=>{
    if(err){
      console.error(err)
      res.status(500).send(err)
    }
    console.log(results)
    res.status(200).send(results)
  })
})

//Export the router
module.exports = router;