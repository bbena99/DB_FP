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

  const teacherBool = req.query.Teacherbool
  let userDef = {type:'Student',verb:'TAKES'}
  if(teacherBool)userDef = {type:'Teacher',verb:'TEACHES'}

  //Debug console.logs
  console.log(` GET to "/Users/:Username/Classes" was called proper
      Username='${username}'    userDef.type=${userDef.type}    userDef.verb=${userDef.verb}`)
  
  // query the db for class[] and store in "returnClasses"
  let sqlquery =
  `SELECT DISTINCT ${userDef.type}.Username, Class.CourseNumber, Class.Department, Class.Section, TeacherOfClass.TeacherUsername 
      FROM ${userDef.type} JOIN ${userDef.verb} JOIN Class JOIN (
        SELECT TEACHES.Username as TeacherUsername
          FROM TEACHES JOIN Class
          ON TEACHES.CourseNumber = Class.CourseNumber
          AND TEACHES.Department = Class.Department
          AND TEACHES.Section = Class.Section
      ) AS TeacherOfClass
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
    results.map((r)=>{
      delete r.Password
    })
    console.log(results)
    res.status(200).send(results)
  })
})

/**
 * GET "/Users/:username/Classes/:ClassId"
 * @description Get a list of all Students for a Class
 * 
 * @param req.param.username Teacher
 * @param req.param.ClassId class to get roster of (in form of a comma separated list) 
 * 
 * @returns {Student[]}
 */
router.get('/Users/:Username/Classes/:ClassId',(req,res,next)=>{
  let strarr = req.params.ClassId.split(',')
  
  let sqlquery=
  `SELECT Student.* 
    FROM Student JOIN TAKES
    ON Student.Username = TAKES.Username
    WHERE TAKES.Department = '${strarr[0]}' AND TAKES.CourseNumber = ${strarr[1]} AND TAKES.Section = ${strarr[2]}`

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
 * GET "/Users/:username/Classes/:ClassId"
 * @description Get a list of all Students for a Class
 * 
 * @param req.param.username Teacher
 * @param req.param.ClassId class to get roster of (in form of a comma separated list) 
 * @param req.body.stdMap Map obj of the student list to add to TAKES
 * 
 * @returns {boolean}
 */
router.put('Users/:Username/Classes/:ClassId',(req,res,next)=>{
  let reqMap = new Map(req.body.stdMap)
  let strarr = req.params.ClassId.split(',')
  let sqlquery=
  `SELECT TAKES.Username
    FROM TAKES 
    WHERE TAKES.Department = '${strarr[0]}' AND TAKES.CourseNumber = ${strarr[1]} AND TAKES.Section = ${strarr[2]}`

    mysqlConnection.query(sqlquery, (err,results,fields)=>{
      if(err){
        console.error(err)
        res.status(500).send(err)
      }
      let deleteArr
      results.map((r)=>{
        if(reqMap.has(r.Username)) reqMap.delete(r.Username)
        else deleteArr.push(r.Username)
      })
      reqMap.forEach((student,Username)=>{
        let sqlInsert =
        `INSERT INTO TAKES (Username, Department, CourseNumber, Section)
          VALUES ('${Username}', '${strarr[0]}', ${strarr[1]}, ${strarr[2]})`
          mysqlConnection.query(sqlInsert, (err,results,fields)=>{
            if(err){
              console.error(err)
              res.status(500).send(err)
            }
            console.log(results)
          })
      })
      deleteArr.map(Username=>{
        let sqlDelete = 
        `DELETE FROM TAKES 
          WHERE Username = '${Username}' AND TAKES.Department = '${strarr[0]}' AND TAKES.CourseNumber = ${strarr[1]} AND TAKES.Section = ${strarr[2]}`
        mysqlConnection.query(sqlDelete, (err,results,fields)=>{
          if(err){
            console.error(err)
            res.status(500).send(err)
          }
          console.log(results)
        })
      })
      console.log(results)
      res.status(200).send(true)
    })
})
//Export the router
module.exports = router;