const { json } = require("express");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistModel = require("../models/blacklistToken.model");

// Register a new user
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);

  const { fullname, email, password } = req.body;
  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashedPassword,
  });
  console.log("User created:", user);

  const token = user.generateAuthToken();

  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
};

// login
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({
    message: "Login successful",
    user,
    token,
  });
};

// Get user profile
module.exports.getUserProfile = async (req, res, next) => {
  try {
    console.log("Fetching profile for user:", req.user);
    res.status(200).json({
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    console.error(err);
  }
};

// Logout user
module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie("token");
  await blacklistModel.create({ token });
  res.status(200).json({ message: "Logout successful" });
};
