//import the express module
const express = require("express");
//create an instance of express server
const app = express();
const connectDB=require("./config/database.js");
const User=require("./models/user.js");
//it will work for all the routes in the application
app.use(express.json());

app.post("/signup",async (req,res)=>{
    const userObj=req.body;
    //creating a new instance of a userModel
    const user=new User(userObj);
    try{
        await user.save();
        res.send("user Added successfully")
    }catch(err){
        res.status(400).send("Error in adding user",err.message);
    } 
});
//Get user by EmailID
app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const users=await User.findOne({emailId:userEmail});
        if(users.length===0){
            res.status(404).send("User not found")
        }else{
            res.send(users);
        }  
    }catch(err){
        res.status(400).send("Error in fetching user")
    }
});
//Feed API-GET /feed -get all the users from the database
app.get("/feed",async (req,res)=>{
    try{
    const users=await User.find({});
    res.send(users);
    }catch(err){
        res.status(400).send("Error in fetching users")
    }
});
app.delete("/user",async (req,res)=>{
    const userId=req.body.userId;
    try{
    const user=await User.findByIdAndDelete({_id:userId});
    if(!user){
        res.status(404).send("User not found")
    }else{
        res.send("user deleted successfully");
    }
    }catch(err){
        res.status(400).send("Error in deleting user",err.message)
    }
});
app.patch("/user",async (req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        const user=await User.findByIdAndUpdate(userId,data,{returnDocument:'after'});
        console.log('user: ', user);
        if(!user){
            res.status(404).send("User not found")
        }
        res.send("user updated successfully")
    }catch(err){

    }
})
connectDB()
.then(()=>{
    console.log("Database connected")
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
})
.catch(err=>{
    console.error(`Database connection error: ${err.message}`)
})

