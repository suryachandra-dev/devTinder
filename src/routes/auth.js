const express=require("express");
const authRouter=express.Router();
const {
  validateSignUpData,
  emailValidation,
} = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
      //validation of data
      validateSignUpData(req);
      const { password } = req.body;
      //Encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
      console.log("passwordHash: ", passwordHash);
      const { firstName, lastName, emailId ,age,skills,photourl,gender} = req.body;
      //creating a new instance of a userModel
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        ...(age && {age}),
        ...(skills && {skills}),
        ...(photourl && {photourl}),
        ...(gender && {gender})
      });
      const savedUser=await user.save();
      const token=await savedUser.getJWT();
      res.cookie("authToken",token,{expires:new Date(Date.now()+8*3600000) })
      res.json({"message":"user Added successfully",data:savedUser});
    } catch (err) {
      res
        .status(400)
        .send({ message: "Error in adding user", error: err.message });
    }
});
authRouter.post("/login", async (req, res) => {
    try {
      //Extract emailId,password from the request body
      const { emailId, password } = req.body;
      emailValidation(emailId);
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Invalid Credentials");
      }
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      }
      const token = await user.getJWT();
      console.log("token: ", token);
      //Add the JWT token to cookie and send the response back to the user
      res.cookie("authToken", token, { expires: new Date(Date.now() + 8 * 3600000) });
      res.send(user);
    } catch (err) {
      res.status(400).send("Error in Login " + err.message);
    }
  });
authRouter.post("/logout",async (req,res)=>{
    try{
      res.cookie("authToken",null,{
        expires:new Date(Date.now()),
      }).send("Logout Successful");
    }catch(err){
      res.status(400).send("Error in logout");
    }
})
module.exports={authRouter};
