   const express=require("express")
   const connectDB=require('./config/database')
   const User=require('./model/user')
   const {validateSignUpData}=require('./utils/validations')
   const bcrypt = require('bcrypt');
   const cookie=require('cookie-parser')
   var jwt = require('jsonwebtoken');

   const app=express()

  
   app.use(express.json())
   app.use(cookie())

  const authRouter=require("./routes/auth")
  const requestRouter=require("./routes/request")
  const profileRouter=require("./routes/profile")
  const userRouter = require("./routes/user")

  app.use('/',authRouter)
  app.use('/',requestRouter)
  app.use('/',profileRouter)
  app.use('/',userRouter)

  connectDB().then(() => {
   console.log("successfull DB Connection")
   app.listen(3000,()=>{
      console.log("Server run started")
     })   
  }).catch((err) => {
   console.log("Error log + " + err)
  });
 