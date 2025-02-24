//import the express module
const express=require("express");
//create an instance of express server
const app=express();
//request handler with no path which handles all the requests coming to the server
// app.use((req,res)=>{
//     res.send("hello from the test path");
// });
//if it has a path it will be handled by the path handler===>localhost:3000/test
app.use("/test",(req,res)=>{
    res.send("hello from the test path");
});
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})