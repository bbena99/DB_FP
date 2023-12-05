const express = require('express');
const { mysqlConnection } = require('../sqlConnect/Connection');
var router = express.Router();

//Start of variables to use

//Start of endpoints
/**
 * ALL "/Users/:Username/Classes"
 */
router.all('/Users/:Username/Classes',(req,res,next)=>{
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
router.post('/Users/:Username/Classes', (req,res,next)=>{
  //Get params
  const username = req.params.Username
  let newClass = req.body
  //Debug console.logs
  console.log(`  POST to "/User/:Username/Classes" was called
  Username : ${username}
  Class :`)
  console.log(newClass)

  //Check if teacher Return status(401) if not
  let sqlquery=
  `SELECT * FROM Teacher WHERE Username = '${username}'`
  mysqlConnection.query(sqlquery, (err,results,fields)=>{
    if(err){
      console.error(err)
      res.status(404).send(err)
    }
    console.log(results);
    //Make query to make class
    //Return status(200)
    sqlquery=
    `INSERT INTO Class (Name, Department, CourseNumber, Section)
      VALUES ('${newClass.Name}', '${newClass.Department}', ${newClass.CourseNumber}, ${newClass.Section})`
    mysqlConnection.query(sqlquery, (err,results,fields)=>{
      if(err){
        console.error(err)
        res.status(500).send(err)
      }
      console.log(results);
      res.status(200).send(results)
    })
  })
})

/**
 * GET "/Users/:username/Classes"
 * @description Get a list of all classes for a user
 * 
 * @param req.param.username
 * 
 * @returns {Class[]}
 */
router.get('/Users/:Username/Classes', (req,res,next)=>{
  //Get params
  const username = req.params.Username
  let returnClasses
  
  //Debug console.logs
  console.log(`   GET to "/Users/:Username/Classes" was called proper
      Username =`,username)
  
  // query the db for class[] and store in "returnClasses"
  let sqlquery =
  `SELECT * 
      FROM Student JOIN TAKES JOIN Class
      ON Student.Username = TAKES.Username
      AND TAKES.CourseNumber = Class.CourseNumber
      AND TAKES.Department = Class.Department
      AND TAKES.SectionNumber = Class.SectionNumber
      WHERE Student.Username = ${username}`

      mysqlConnection.query(sqlquery, (err,results,fields)=>{
        if(err){
          console.error(err)
          res.status(500).send(err)
        }
        console.log(results);
        res.status(200).send([])
        })
  
})
//Export the router
module.exports = router;