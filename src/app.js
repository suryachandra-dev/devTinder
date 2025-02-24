//import the express module
const express=require("express");
//create an instance of express server
const app=express();
//This will handle only GET call to /user
app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.params);
    res.send({"firstName":"Surya"})
});

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})