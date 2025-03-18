const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    status: {
      type: String,
      required:true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);
// ConnectionRequest.find({fromUserId,toUserId})
connectionRequestSchema.index({fromUserId:1,toUserId:1,status:1});
connectionRequestSchema.pre("save",function(next){
  const connectionRequest=this;
  //check if fromUserId and toUserId are same
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("fromUserId and toUserId cannot be same");
  }
  next();
});
const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequestModel;
