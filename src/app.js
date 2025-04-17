require("dotenv").config(); // 👈 load .env variables
//import the express module
const express = require("express");
//create an instance of express server
const app = express();
const connectDB = require("./config/database.js");
const {authRouter}=require("./routes/auth.js");
const {profileRouter}=require("./routes/profile.js");
const {requestRouter}=require("./routes/requests.js");
const {paymentRouter}=require("./routes/payment.js");
const cors=require("cors");
require("./utils/cronJob.js");
let corsOptions = {
  origin: "http://localhost:5173", // Allow requests only from this origin (your frontend)
  credentials: true,               // ✅ Allow browser to send/receive cookies
};
app.use(cors(corsOptions));         // Enable CORS with these settings
//it will work for all the routes in the application
app.use(express.json());
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/user.js");
app.use(cookieParser());
app.use("/",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/user",userRouter);
app.use("/payment",paymentRouter);
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${3000}`);
    });
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
  });
