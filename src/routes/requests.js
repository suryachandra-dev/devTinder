const express=require("express");
const requestRouter=express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const { default: mongoose } = require("mongoose");
const User = require("../models/user.js");
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
      const fromUserId = new mongoose.Types.ObjectId(req.user._id);
      const toUserId=new mongoose.Types.ObjectId(req.params.toUserId);
      const status=req.params.status;
      const allowedStatus=["ignored","interested"];
      if(!allowedStatus.includes(status)){
        throw new Error("Invalid status "+status);
      }

      //Check if the userId exixts in user collection
      const toUser=await User.findById(toUserId);
      if(!toUser){
        throw new Error("User not found");
      }
      //check if there is an existing ConnectionRequest
      const existingConnectionRequest=await ConnectionRequest.findOne({$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]});
      if(existingConnectionRequest){
        throw new Error("Connection Request already exsists")
      }
      const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data=await connectionRequest.save();
      res.json({
        message:req.user.firstName+" is "+status+" in "+toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  });
module.exports={requestRouter};