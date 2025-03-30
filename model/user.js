const mongoose=require('mongoose');
const validator = require('validator');
var jwt = require('jsonwebtoken');
   const bcrypt = require('bcrypt');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },emailId:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:function(value){
            if(!validator.isEmail(value))
                throw new Error("Invalid email address: "+ value);
        }
    },password:{
        type:String,
        required:true
    },age:{
        type:Number,
        min:18
    },gender:{
        type:String,
        validate:function(value){
            if(!["male","female","other"].includes(value))
                throw new Error("Gender data is not valid")
        }
    },about:{
        type:String,
        default:"This is default value"
    },Skills:{
        type:[String]
    }
},{timestamps:true})
userSchema.methods.getJWT=async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id }, 'shhhhh');
    return token
}
userSchema.methods.validatePassword=async function(password){
    const user=this;
    const isPasswordValid=await bcrypt.compare(password,user.password)
    return isPasswordValid
}

const User = mongoose.model("User",userSchema);
module.exports=User

// module.exports=mongoose.model("User",userSchema);