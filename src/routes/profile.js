const express=require("express");
const profileRouter=express.Router();
const { userAuth } = require("../middlewares/auth.js");

profileRouter.get("/", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.status(400).send("Error in getting profile " + err.message);
    }
  });
module.exports={profileRouter};