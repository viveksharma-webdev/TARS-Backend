const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');
require('dotenv').config();
const verifyToken = async (req, res, next) => {
  if(!req.cookies.token){
    return res.status(401).send("Unauthenticated");
  }
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded token:", decoded); // Log decoded token for debugging

    const user = await userModel.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      console.log("User not found");
      return res.status(401).send("Unauthorized");
    }

    req.user = user;
    console.log("User authenticated");
    next(); 

  } catch (error) {
    console.log("Error in token verification:", error.message);
    return res.status(401).send("Unauthorized");
  }
}

module.exports = verifyToken;
