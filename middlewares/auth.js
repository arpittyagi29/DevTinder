var jwt = require('jsonwebtoken');
const User=require("../model/user")
const userAuth= async(req,res,next)=>{
   try{ 
   const {token}=req.cookies;
   if(!token){
    throw new Error("Token is invalid")
   }
   const decodeObj= await jwt.verify(token,"shhhhh")
   const {_id}=decodeObj
   const user=await User.findById(_id);
   if(!user){
    throw new Error("user not founds")
   }
   req.user=user
  next();
   }
   catch(err){
    res.status(400).send("Error Message "+ err.message)
   }
}
module.exports={
    userAuth
}