const express=require('express')
const User=require('../model/user')
const profileRouter=express.Router()
const {userAuth}=require('../middlewares/auth')
const {validEditProfile}=require('../utils/validations')
const bcrypt = require('bcrypt');

profileRouter.get('/profile',userAuth,async(req,res)=>{
    try{
       const user=req.user
            res.status(200).send(user)
    }
    catch(err){
       res.status(400).send("Error Message "+ err)
      }
   })
profileRouter.post('/profile/edit',userAuth,async(req,res)=>{
   try{
const isValid=validEditProfile(req)
if(!isValid){
   throw new Error("You cannot Edit these feilds")
}
const logUser=req.user
console.log(logUser)
Object.keys(req.body).forEach(key=>logUser[key]=req.body[key])
await logUser.save();
res.json({message:"Edit SuccessFull", data:logUser})
   }
   catch(err){
      res.status(400).send("Error Message "+ err)
     }
})

profileRouter.post("/profile/password",userAuth,async(req,res)=>{
   const logUser=req.user
   const hashpassword= await bcrypt.hash(req.body.password,10)
   logUser.password=hashpassword
   logUser.save()
   res.send(`${logUser.firstName} , Your Password Updated`)
})


   module.exports=profileRouter

