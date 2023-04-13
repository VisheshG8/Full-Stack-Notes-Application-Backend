const express = require("express");
const router =  express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

// Create a user using POST "/api/auth/createuser". No login required 
router.post('/createuser',[
  body('name',"Enter a valid name").isLength({ min: 3 }),
  body('email',"Enter a valid e-mail").isEmail(),
  // password must be at least 5 chars long
  body('password',"Please follow the password rules ").isLength({ min: 5 }), ]
, async (req,res) =>{
    
  // If there are errors, return the bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  // Check whether the user with same email  exists already 
  try{
  
  let user =  await User.findOne({email: req.body.email});
  if(user){
    return res.status(400).json({ error: "Sorry a user with this email already exists" });

  }
  console.log(user);
     user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  })
  // .then(user => res.json(user)).catch(err=> {console.log(err)
  //   res.json({note: "This email is already registered" ,
  // message:err.message})} )
    res.json(user)
}
catch(error){
  console.error(error.message)
  res.status(500).send("some error occured");
}
});
 
module.exports =  router; 