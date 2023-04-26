const express = require("express");
const router =  express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Vish'

// ROUTE: 1 -  Create a user using POST "/api/auth/createuser". No login required 
router.post('/createuser',[
  body('name',"Enter a valid name").isLength({ min: 3 }),
  body('email',"Enter a valid e-mail").isEmail(),
  // password must be at least 5 chars long
  body('password',"Please follow the password rules ").isLength({ min: 5 }), ]
, async (req,res) =>{
  let success = false;
    
  // If there are errors, return the bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, error: errors.array() });
  }
  // Check whether the user with same email  exists already 
  try{
  
  let user =  await User.findOne({email: req.body.email});
  if(user){
    return res.status(400).json({ success, error: "Sorry a user with this email already exists" });

  }
  const salt = await bcrypt.genSalt(10)
  const secPass = await bcrypt.hash(req.body.password,salt) 
  // Create a new user 
     user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
  })

  const data = {
    user:{
      id: user.id 
    }
  }

  const  authToken = jwt.sign(data,JWT_SECRET )

  // .then(user => res.json(user)).catch(err=> {console.log(err)
  //   res.json({note: "This email is already registered" ,
  // message:err.message})} )
    success = true;
    res.json({success, authToken})
}
catch(error){
  console.error(error.message)
  res.status(500).send("some error occured");
}
});

// ROUTE: 2 -  Authenticate a user using POST "/api/auth/login". No login required 
router.post('/login',[
  body('email',"Enter a valid e-mail").isEmail(),
  // password must be at least 5 chars long
  body('password',"Please follow the password rules ").exists()]
  , async (req,res) =>{
    let success = false;
    
    // If there are errors, return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, error: errors.array() });
    }

    const {email , password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
          success = false;
          return res.status(400).json({success ,error:"Please try to login with correct credentials"});
        }
        const passwordCompare =  await bcrypt.compare(password,user.password);
        if(!passwordCompare){
          success = false;
          return res.status(400).json({success, error:"Please try to login with correct credentials"});
          
        }

        const data = {
          user:{
            id: user.id 
          }
        }
      
        const  authToken = jwt.sign(data,JWT_SECRET )
        success = true;
        res.json({success , authToken})

    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Interal server error ");
    }
  }
)

// ROUTE: 3 -  Get logged in user details using POST "/api/auth/getuser" login required 
router.post('/getuser' ,fetchuser, async (req,res) =>{
    let success = true
try {
     let userid = req.user.id;
    const user = await User.findById(userid).select("-password")
    res.send(user);
} 
 catch(error){
        console.error(error.message)
        res.status(500).send("Interal server error ");
    }
  })
module.exports =  router; 