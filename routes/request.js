const express=require('express')
const User=require('../model/user')
const requestRouter=express.Router()
const {userAuth}=require('../middlewares/auth')
const ConnectionRequest = require('../model/connectRequest')

requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
  try{
    // console.log("Request Send")
    fromUserId=req.user._id;
    toUserId=req.params.toUserId;
    status=req.params.status;
   allowedStatus=['interested','ignore'];
   if(!allowedStatus.includes(status)){
    res.status(400).json({message:"invalid Status"})
   }
   const toUser=await User.findById(toUserId)
   if(!toUser){
    return res.status(404).json({message:"User not Found"})
   }

   const existingConnectionRequest=await ConnectionRequest.findOne({
    $or:[
      {fromUserId,toUserId},
      {fromUserId:toUserId, toUserId:fromUserId}
    ]
   })
   if(existingConnectionRequest){
    return res.status(400).send({message:"Duplicate Request"})
   }
   const connectionRequest=new ConnectionRequest({
    fromUserId,toUserId,status
   })
   const data= await connectionRequest.save();
     res.json({message:req.user.firstName+" "+ status +" "+ toUser.firstName,data:data})
  }
  catch(err){
    res.status(400).send("Error "+err.message)
  }
  }) 
requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
  try{
   const loggedInUser=req.user;
   const{status,requestId}=req.params
   const allowedStatus=["accepted","rejected"];
   if(!allowedStatus.includes(status)){
    res.status(400).json({message:"Status not allowed"})
   }
   const connectionRequest=await ConnectionRequest.findOne({
    _id:requestId,
    toUserId:loggedInUser._id,
    status:"interested"
   })
   if(!connectionRequest){
    return res.status(404).json({message:"Connection request not found"})
   }
   connectionRequest.status=status;
   const data=await connectionRequest.save();

   res.status(404).json({message:"connect status update "+ status,data})
  }
  catch(err){
    res.status(400).send("Error "+err.message )
  }
})
module.exports=requestRouter