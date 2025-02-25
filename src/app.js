//import the express module
const express = require("express");
//create an instance of express server
const app = express();
// app.use("/user",rh1,rh2,rh3,rh4,rh5);
app.use(
  "/user",
  [(req, res, next) => {
    console.log("handling the route user 1");
    next();
    // res.send("1st request handler")
  },
  (req, res,next) => {
    console.log("handling the route user 2");
    next();
    // res.send("2nd request handler");
  }]
  ,
  (req, res,next) => {
    console.log("handling the route user 3");
    res.send("3rd request handler");
    next();
  }
);
//This will handle only GET call to /user
app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Surya" });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
