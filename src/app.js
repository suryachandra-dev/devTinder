require("dotenv").config(); // 👈 load .env variables
//import the express module
const express = require("express");
//create an instance of express server.App is express application
const app = express();
const connectDB = require("./config/database.js");
const {authRouter}=require("./routes/auth.js");
const {profileRouter}=require("./routes/profile.js");
const {requestRouter}=require("./routes/requests.js");
const {paymentRouter}=require("./routes/payment.js");
const cors=require("cors");
//import the http module for socket.io
const http = require("http");
//Import cronJobs file
require("./utils/cronJob.js");
//I created a server using the existing express application
const server=http.createServer(app);


let corsOptions = {
  origin: "http://localhost:5173", // Allow requests only from this origin (your frontend)
  credentials: true,               // ✅ Allow browser to send/receive cookies
};
app.use(cors(corsOptions));         // Enable CORS with these settings
//it will work for all the routes in the application
app.use(express.json());
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/user.js");
const { initializeSocket } = require("./utils/socket.js");
const { chatRouter } = require("./routes/chat.js");
app.use(cookieParser());
app.use("/",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/user",userRouter);
app.use("/payment",paymentRouter);
app.use("/chat",chatRouter);
initializeSocket(server);
connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
  });
