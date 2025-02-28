//import the express module
const express = require("express");
//create an instance of express server
const app = express();
const connectDB = require("./config/database.js");
const {authRouter}=require("./routes/auth.js");
const {profileRouter}=require("./routes/profile.js");
const {requestRouter}=require("./routes/requests.js");
//it will work for all the routes in the application
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
  });
