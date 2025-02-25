const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    }
});
//I want User Model for userSchema.Model is like a class which starts with a capital letter.Using User Model you can create new instances of that model.
//Ex:const user1=new userModel({firstName:"Rahul",lastName:"Sharma",emailId:"rahul@gmail.com",password:"rahul123",age:23,gender:"Male"});
module.exports=mongoose.model("User",userSchema);