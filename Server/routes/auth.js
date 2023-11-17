const express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const TeacherModel = require('../schema/Teacher');
//var Userdb = require('../models/users');
//const {v4: uuidv4} = require('uuid');

router.get("/test",(req,res)=>{
    //by hitting '.' it gives you special commands indicated by a star. These are the important ones
    console.log("GET/api/v1/test was called with req.params:")
    console.log(req.params)
    console.log(req.body)
    console.log(req.query)
    console.log("And res:")
    //console.log(res)
    console.log("End of GET/api/v1/test!")
    //tl:dr, these are big objects with a lot of data that you typically don't want to log out.
})
/**
 * POST "/login"
 * Is used to login an existing user.
 */
router.post("/login", async (req,res) => {
    //console.log("    .post('/login') was called proper");
    let query = req.query;
    /**
     * query should look like this:
     * 
     *  query = {
     *      username: string,
     *      password: string
     *  }
     */
    console.log(query);
    //let user = await Userdb.findOne({username:query.username});
    if(user==undefined&&user.enabled==true){
        res.status(404).send("User not found");
        return;
    }
    let TM = new TeacherModel();
    console.log(TM);
    //console.log(user);
    const ERROR = "Invalid credentials";
    let correct = await bcrypt.compare(req.query.password,user.password);
    if(correct){
        req.session.user = user;
        //console.log(req.session);
        res.status(200).send(user);
    }
    else res.status(401).send(ERROR);
});

/**
 * POST "/createUser"
 * Is used to create a new user
 */
router.post("/createUser", async (req,res) => {
    //console.log("    .post('/createUser') was called proper");
    //console.log(req.query);
    if(req.query=={}){
        res.status(400).send('NO QUERY FOUND');
        return;
    }
    /*if(await Userdb.findOne({'username':req.query.username})){
        res.status(408).send('USERNAME TAKEN');
        return;
    }*/
    //let encrypted = await bcrypt.hash(req.query.password,10);
    //let newUser = {'username' : req.query.username , 'password' : encrypted, 'admin': false, 'enabled' : true};
    //let dbUser = await Userdb.create( newUser );
    /*
    console.log("Before the for loop");
    for(let i=0; i<1200; i++){
        console.log(i);
        let name = uuidv4();
        let pw = await bcrypt.hash('123',10);
        let botUser = {
            'username' : name,
            'password' : pw,
            'admin' : false,
            'enabled' : true
        }
        await Userdb.create(botUser);
    }
    console.log("end of for loop");
    */
    req.session.regenerate((err)=>{
        if(err){
            console.log("Error in regenerate: "+err);
        }
        req.session.user = dbUser;
    });
    res.status(201).send(dbUser);
});

/**
 * POST "/logout"
 * Logs a user out
 */
router.post("/logout", (req, res) => {
    req.session.destroy( () => {
        //console.log( req.session );
        res.status(200).send({});
    });
});

/**
 * GET "/who"
 * Is used to validate user
 */
router.get("/who", (req,res,next)=>{
    //console.log("    GET '/who' was called")
    let result = req.session.user && req.session;
    //console.log(result);
    res.json( result );
});

/**
 * ALL "*"
 * Is used to validate user
 */
router.all( '*', (req,res,next)=>{
    //console.log("    .all('*') was called");
    //console.log(req.session);
    if( req.session && req.session.user){
        //console.log("User found ☺");
        next();
    } else if( req.session ){
        req.session.regenerate( err => {
        console.log("No user found");
        //console.log(req.session);
        res.redirect("/");
        });
    } else {
        console.log("No session found");
        res.redirect("/");
    }
});

module.exports = router;