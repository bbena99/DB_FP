const express = require('express');
const { mysqlConnection } = require('../sqlConnect/Connection');
var router = express.Router();
const uuidv4 = require('uuid')
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
  `SELECT Submissions.* FROM Submissions JOINS SUBMITSTO
  ON Submissions.SubmissionID = SUBMITSTO.SubmissionID
  AND SUBMITSTO.AssignmentID = '${params.assignId}'`
  mysqlConnection.query(sqlquery, (err,results,fields)=>{
    if(err){
      console.error(err)
      res.status(500).send(err)
    }
    console.log(results)
    res.status(200).send(results)
  })
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
  let id = uuidv4.v4()
  //sqlquery here
  let sqlquery =
  `INSERT INTO Submissions (SubmissionID, SubmissionDate, StudentAnswer)
    VALUES ('${id}', '${newSubmission.Date}', '${newSubmission.StudentAnswer}')`
  mysqlConnection.query(sqlquery,(err,results,fields)=>{
    if(err){
      console.error(err)
      res.status(500).send(err)
    }
    sqlquery=
    `INSERT INTO SUBMITSTO (AssignmentID, SubmissionID)
      VALUES ('${params.assignId}', '${id}')`
    mysqlConnection.query(sqlquery,(err,results,fields)=>{
      if(err){
        console.error(err)
        res.status(500).send(err)
      }
      sqlquery=
      `SELECT * FROM Submissions
        WHERE Submissions.SubmissionID = '${id}'`
      console.log(results)
      res.status(200).send(results)
    })
  })
})

/**
 * PUT "/Users/:username/Classes/:classId/Assignments/:assignId"
 * @description Update Submission
 * 
 * @param req.params.username username of the user
 * @param req.params.classId id of the class that has the assignments
 * @param req.params.assignId id of the assignment that has the submissions
 * @param req.body newSubmission
 * 
 * @returns {Submission[]}
*/
router.put("/Users/:username/Classes/:classId/Assignments/:assignId/Submissions/:submissionID",(req,res,next)=>{
  const params = req.params
  const classId = params.classId.split('~')
  let data = req.body
  //sqlquery here
  let sqlquery =
  `UPDATE Submissions
    SET 
    Submissions.Points = ${data.Points}
    Submissions.Comments = '${data.Comments}'
      WHERE SubmissionID = '${params.submissionID}`
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