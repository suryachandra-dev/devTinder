const express=require("express");
const requestRouter=express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const { default: mongoose } = require("mongoose");
const User = require("../models/user.js");
const sendEmail=require("../utils/sendEmail.js")
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
      console.log("........................................................");
      const emailRes=await sendEmail.run("A New friend request from  "+req?.user?.firstName,req?.user?.firstName+" is "+status+" in "+toUser?.firstName);//send email
      console.log('emailRes: ', emailRes);
      res.json({
        message:req.user.firstName+" is "+status+" in "+toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  });
  //request/review/accepted/612f6f9b8b6f7d5e8b6f7d5e
  //request/review/rejected/612f6f9b8b6f7d5e8b6f7d5e
  //Elon musk has called the above API and can tell the backend to either accept or reject the requestID
requestRouter.post("/review/:status/:requestId",userAuth,async (req,res)=>{
  try{
    const loggedInUser=req.user;
    const allowedStatus=["accepted","rejected"];
    const {status,requestId}=req.params;
    if(!allowedStatus.includes(status)){
      throw new Error("Invalid Status ");
    }
    const connectionRequest=await ConnectionRequest.findOne({_id:requestId,toUserId:loggedInUser._id,status:"interested"});
    if(!connectionRequest){
      throw new Error("Connection Request is not found Or Connection is already validated");
    }
    connectionRequest.status=status;
    const data=await connectionRequest.save();
    res.json({
      message:"Connection Request is "+status,
      data,
    })
    //Validate the status
    /**
     * Akshay =>(sends connection request to) Elon
     * Is Elon Musk a loggedIn User===toUserId
     * status=interested
     * requestId should be valid
     */
  }catch(err){
    res.status(400).send("Error "+err.message);
  }
});

module.exports={requestRouter};