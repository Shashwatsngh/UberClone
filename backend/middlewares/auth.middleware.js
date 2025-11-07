const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistToken.model");
 

// Authenticate user middleware
module.exports.authUser = async (req, res, next) =>
{
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token)
  {
    console.error("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blacklistModel.findOne({ token: token });
  if (isBlacklisted)
  {
    console.error("Token is blacklisted");
    return res.status(401).json({ message: "Unauthorized" });
  }
   
  try
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user= await userModel.findById(decoded._id);
    req.user = user;
    return next(); 
  }
  catch (err)
  {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }

  

};
