const express=require("express")
const userRouter=express.Router()
const {userAuth}=require('../middlewares/auth')
const ConnectionRequest = require('../model/connectRequest')
const User = require("../model/user")

const USER_SAFE_DATA="firstName lastName age gender about Skills"
userRouter.get('/user/requests/received',userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        if(connectionRequest.length==0){
            res.json({message:"No Pending Request ",data:connectionRequest})
        }
       // console.log(connectionRequest)
        res.json({message:loggedInUser.firstName +" has "+connectionRequest.length +" Connection Request"  ,data:connectionRequest})
    }
    catch(err){
     res.status(400).json({message:"Error " + err.message})

    }
})


userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted" }
            ]
        }).populate("fromUserId",USER_SAFE_DATA)
        const data=connectionRequests.map((row)=>{
           if(row.fromUserId._id.toString()===loggedInUser._id.toString())
            return row.toUserId
        return row.fromUserId
        })
         
        res.status(200).json({mesaage:"Data found ", data:data })
    }
    catch(err){
        res.status(400).send("Error" + err.message)
    }
})
userRouter.get('/user/feed',userAuth,async(req,res)=>{
    try{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit
        const skip=(page-1)*10
        const loggedInUser=req.user;
       // console.log(loggedInUser)
        const connectionRequests=await ConnectionRequest.find({
           $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}] 
        }).select("fromUserId toUserId")

const hideUserFromFeed=new Set(); // contains the unique value
connectionRequests.forEach(req=>{
    hideUserFromFeed.add(req.fromUserId.toString())
    hideUserFromFeed.add(req.toUserId.toString())
})

const users=await User.find({
   $and:[{_id:{$nin:Array.from(hideUserFromFeed)}},{_id:{$ne:loggedInUser._id}}]
}).select(USER_SAFE_DATA).skip().limit(limit)
res.json({data:users})
    }

    
    catch(err){
        res.status(400).send("Error" + err.message) 
    }
})

userRouter.get("/user/search",userAuth,async(req,res)=>{
    try{
        const {name}=req.query;
        const name1="^"+name
       // console.log(name1)
        const user= await User.find({firstName:{$regex: `${name1}`, $options: "i"  }})
        //console.log(user)
        res.json({mesaage:"search item", data:user})
    }
    catch(err){
        res.status(400).send("Error" + err.message) 
    } 
})


module.exports=userRouter