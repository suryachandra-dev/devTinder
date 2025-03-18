const express=require("express");
const profileRouter=express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");

profileRouter.get("/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.status(400).send("Error in getting profile " + err.message);
    }
  });
profileRouter.patch("/edit",userAuth,async (req,res)=>{
  try{
    if(!validateEditProfileData(req,res)){
      throw new Error("Invalid Edit data");
    }
    const loggedInUser=req.user;
    Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);

    

    await loggedInUser.save();
    res.json({"message":` ${loggedInUser.firstName} Profile edited successfully`, "user":loggedInUser});
  }catch(err){
    res.status(400).send("Error in editing profile " +err.message)
  }
})
module.exports={profileRouter};