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

