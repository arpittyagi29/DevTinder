const validator=require('validator');
const { default: isURL } = require('validator/lib/isURL');
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body; 
   if(!firstName || !lastName)
    throw new Error("Name is not Entered")
  else if(!validator.isEmail(emailId))
    throw new Error("Please Enter valid email id")
//  else if(validator.isStrongPassword(password))
//     throw new Error("Please Enter Strong Password")
}
const validEditProfile=(req)=>{
  const feildsEditable=["firstName","lastName","age","gender","about","Skills","url"]
  if(!isURL(url))
    return false;
  if(!isLength(Skills ,[{min:0, max:5}]))
    return false;
  const isValid=Object.keys(req.body).every((feild)=> feildsEditable.includes(feild))
  return isValid;
}

module.exports={
    validateSignUpData,validEditProfile
}