const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  socketid: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  vehicle: {
    colour: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
      minlength: [3, "Plate number must be at least 3 characters long"],
    },
    capacity: {
      type: Number,
      min: [1, "Capacity must be at least 1"],
      default: 1,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "bike", "auto"],
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
  },
});

captainSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captainSchema.statics.hashPassword = async function (plainPassword) {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

captainSchema.methods.comparePassword = async function (plainPassword) {
  const bcrypt = require("bcrypt");
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("Captain", captainSchema);
