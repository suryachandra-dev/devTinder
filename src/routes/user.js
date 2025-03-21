const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photourl age gender about skills";
//Get all the pending connection requests for the loggedIn user
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      /** We can populate the data in two ways
       * .populate("fromUserId",["firstName","lastName"])
       * .populate("fromUserId","firstName lastName")
       */
      .populate("fromUserId", USER_SAFE_DATA);
    res.status(200).json({
      success: true,
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    /**
     * Akshay =>Elon Musk accepted
     * Elon Musk => Mark accepted
     */
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connections.map((row) => {
      if (!row.fromUserId._id.equals(loggedInUser._id)) {
        return row.fromUserId;
      }
      return row.toUserId;
    });
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    let limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Find all users to hide
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((conn) => {
      hideUsersFromFeed.add(conn.fromUserId.toString());
      hideUsersFromFeed.add(conn.toUserId.toString());
    });
    hideUsersFromFeed.add(loggedInUser._id.toString()); // Hide own profile

    // Get total available users (excluding hidden ones)
    const totalUsers = await User.countDocuments({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    });


    // Prevent skipping beyond available users
    // if (skip >= totalUsers) {
    //   return res.json({ data: [] }); // No more users left to fetch
    // }

    // Fetch users
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = { userRouter };
