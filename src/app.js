//import the express module
const express = require("express");
//create an instance of express server
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validateSignUpData ,emailValidation} = require("./utils/validation.js");
const bcrypt=require("bcrypt");
//it will work for all the routes in the application
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);   
    const {password}=req.body;
    //Encrypt the password
    const passwordHash=await bcrypt.hash(password,10);
    console.log('passwordHash: ', passwordHash);
    const {firstName,lastName,emailId} = req.body;
    //creating a new instance of a userModel
    const user = new User({
        firstName,lastName,emailId,password:passwordHash
    });
    await user.save();
    res.send("user Added successfully");
  } catch (err) {
    res
      .status(400)
      .send({ message: "Error in adding user", error: err.message });
  }
});
app.post("/login",async (req,res)=>{
    try{
        //Extract emailId,password from the request body
        const {emailId,password}=req.body;
        emailValidation(emailId);
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid=await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }
        res.send("Login Successful");
    }catch(err){
        res.status(400).send("Error in Login "+err.message);
    }
})
//Get user by EmailID
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error in fetching user");
  }
});
//Feed API-GET /feed -get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error in fetching users");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("user deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Error in deleting user", err.message);
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photourl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    // {
    //     "userId":"67bed448f7fb6a097275363d",
    //     "lastName":"bhatt",
    //     "firstName":"Alia",
    //     "age":33,
    //     "password":"Alia123",
    //     "gender":"female",
    //     "emailId":"AliaBhattttttttttttttttt@gmail.com",
    //     "xyz":"xyz"

    // }
    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log("user: ", user);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("Error in updating user " + err.message);
  }
});
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
