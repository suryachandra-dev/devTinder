const validator=require("validator");
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email Id")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Weak Password")
    }
}
const emailValidation=(emailId)=>{
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email Id");
    }
}
module.exports={validateSignUpData,emailValidation};