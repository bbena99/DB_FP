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
      console.log(results)
      sqlquery=
      `INSERT INTO TEACHES (Username, Department, CourseNumber, Section)
          VALUES ('${username}', '${newClass.Department}', ${newClass.CourseNumber}, ${newClass.Section})`
          mysqlConnection.query(sqlquery, (err,results,fields)=>{
            if(err){
              console.error(err)
              res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results)
          })
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

  const teacherBool = req.query.Teacherbool
  let userDef = {type:'Student',verb:'TAKES'}
  if(teacherBool)userDef = {type:'Teacher',verb:'TEACHES'}

  //Debug console.logs
  console.log(` GET to "/Users/:Username/Classes" was called proper
      Username='${username}'    userDef.type=${userDef.type}    userDef.verb=${userDef.verb}`)
  
  // query the db for class[] and store in "returnClasses"
  let sqlquery =
  `SELECT * 
      FROM ${userDef.type} JOIN ${userDef.verb} JOIN Class
      ON ${userDef.type}.Username = ${userDef.verb}.Username
      AND ${userDef.verb}.CourseNumber = Class.CourseNumber
      AND ${userDef.verb}.Department = Class.Department
      AND ${userDef.verb}.Section = Class.Section
      WHERE ${userDef.type}.Username = '${username}'`
  mysqlConnection.query(sqlquery, (err,results,fields)=>{
    if(err){
      console.error(err)
      res.status(500).send(err)
    }
    console.log(results)
    res.status(200).send([])
  })
})
//Export the router
module.exports = router;