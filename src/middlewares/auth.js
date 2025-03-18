const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { authToken } = cookies;
    if (!authToken) {
      return res.status(401).send("User not authenticated,Please Login");
    }
    //validate user token
    const decodedMessage = await jwt.verify(authToken, "DEVTinder&26022025");
    // It contains the payload of the user
    // decodedMessage={ _id: '67bf00d47bfd3985dd2e8450', iat: 1740580102 }
    const { _id } = decodedMessage; //I got the information about the logged in user
    console.log("Logged in user is " + _id);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
};
module.exports = { userAuth };
