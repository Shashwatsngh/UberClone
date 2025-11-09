const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const blacklistModel = require("../models/blacklistToken.model");

// Register a new captain
module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);

  const { fullname, email, password, vehicle } = req.body;

  const isCaptainExists = await captainModel.findOne({ email });
  if (isCaptainExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashedPassword,
    vehicle: {
      colour: vehicle.colour,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    },
  });
  console.log("Captain created:", captain);

  const token = captain.generateAuthToken();

  res.status(201).json({
    message: "Captain registered successfully",
    captain,
    token,
  });
};

// Captain login
module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await captain.comparePassword(
    password,
    captain.password
  );
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({
    message: "Captain logged in successfully",
    captain,
    token,
  });
};

// Get captain profile
module.exports.getCaptainProfile = async (req, res, next) => {
  try {
    console.log("Fetching profile for captain:", req.captain);
    res.status(200).json({
      captain: req.captain,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    console.error(err);
  }
};

// captain logout
module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie("token");
  await blacklistModel.create({ token });
  res.status(200).json({ message: "Logout successful" });
};
