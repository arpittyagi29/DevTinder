const express=require('express')
const authRouter=express.Router()
const {validateSignUpData}=require('../utils/validations')
const User=require('../model/user')
const bcrypt = require('bcrypt');
const cookie=require('cookie-parser')

authRouter.post('/signup',async (req,res)=>{
    try{
     validateSignUpData(req)
     const {firstName,lastName,emailId,password}=req.body
     const hashpassword= await bcrypt.hash(password,10)
     const user =new User({
        firstName,
        lastName,
        emailId,
        password:hashpassword
     })
     await user.save();
     res.send("User Added Successfully")
    }
    catch(err){
     res.status(400).send("Error Message: "+ err)
  // 
  console.log(err)
    }  
  })

authRouter.post('/login',async(req,res)=>{
    try{
     const {emailId, password}=req.body;
     const user=await User.findOne({emailId:emailId})
     if(!user){
       throw new Error("Please enter valid email Id")
     }
     const isValidPassword= await user.validatePassword(password)
     if(isValidPassword){
       var token = await user.getJWT();
       res.cookie("token",token)
       res.send("Login Successful \n"+ user)
     }
    else
    throw new Error("Please Enter valid password")
    }
    catch(err){
       res.status(400).send("Error Message \n "+ err)
      }  
 })
 authRouter.post('/logout',async(req,res)=>{
  res.cookie("token",null ,{ expires: new Date(Date.now())})
  res.send("Logout Successfull");
 })


module.exports=authRouter