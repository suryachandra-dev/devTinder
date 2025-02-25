//import the express module
const express = require("express");
const {adminAuth}=require("./middlewares/auth.js");
//create an instance of express server
const app = express();
app.use((req,res,next)=>{
    console.log(`Request Method: ${req.method},URL:${req.url}`);
    next();
})
app.use("/",(err,req,res,next)=>{

    console.log("it is called",err);
    res.status(500).send("middleware")
});
app.get("/getUserData",(req,res)=>{
    //Logic of db call  and get user data
    try{
        throw new Error("Something went wrong")
    res.send("User data sent")
    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
    
})
app.use("/admin",adminAuth);
app.get("/admin/getAllData",(req,res)=>{
    res.send("All data sent")

})
app.get("/admin/deleteUser",(req,res)=>{
    res.send("User deleted")
})
// app.use("/user",rh1,rh2,rh3,rh4,rh5);
// app.use(
//   "/user",
//   [(req, res, next) => {
//     console.log("handling the route user 1");
//     next();
//     // res.send("1st request handler")
//   },
//   (req, res,next) => {
//     console.log("handling the route user 2");
//     next();
//     // res.send("2nd request handler");
//   }]
//   ,
//   (req, res,next) => {
//     console.log("handling the route user 3");
//     res.send("3rd request handler");
//     next();
//   }
// );
//Get /users =>middlewares chain =>Request handler
app.get("/user",(req,res,next)=>{
    console.log("handling the route user1");
    next();
});
app.get("/user",(req,res,next)=>{
    console.log("handling the route user1");
    // res.send("handling the route user 2")
    next();
});
//This will handle only GET call to /user
app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Surya" });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
