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
const validateEditProfileData=(req,res)=>{
    const allowedEditFields=["firstName","lastName","photourl","gender","age","about","skills"];
    console.log(req.body);
    const listOfKeys=Object.keys(req.body);
    const isEditAllowed=listOfKeys.every(k=>
        allowedEditFields.includes(k)
    );
    return isEditAllowed;
}
const emailValidation=(emailId)=>{
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email Id");
    }
}
module.exports={validateSignUpData,emailValidation,validateEditProfileData};