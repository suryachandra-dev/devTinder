//import the express module
const express=require("express");
//create an instance of express server
const app=express();
//request handler with no path which handles all the requests coming to the server
// app.use((req,res)=>{
//     res.send("hello from the test path");
// });
//if it has a path it will be handled by the path handler===>localhost:3000/test
//Sequence of route handlers is important
app.use("/test",(req,res)=>{
    res.send("hello from the test path");
});
app.use("/user",(req,res)=>{
    res.send("haaaaaaaaaaaaaaaaaaaaaaaaaahaaa");
});
//This will handle only GET call to /user
app.get("/user",(req,res)=>{
    res.send({"firstName":"Surya"})
});
app.post("/user",(req,res)=>{
    res.send("data sucessfully saved to database")
});
app.delete("/user",(req,res)=>{
    res.send("data sucessfully deleted from database")
})
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})