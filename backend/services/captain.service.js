const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  fullname,
  email,
  password,
  vehicle,
}) => {
  if (!fullname.firstname)
  {
    throw new Error("Firstname is required to create a captain");
  }
  if (!email)
  {
    throw new Error("Email is required to create a captain");
  }
  if (!password)
  {
    throw new Error("Password is required to create a captain");
  }
  if (!vehicle.colour)
  {
    throw new Error("Vehicle colour is required to create a captain");
  }
  if (!vehicle.plate)
  {
    throw new Error("Vehicle plate is required to create a captain");
  }
  if (!vehicle.capacity)
  {
    throw new Error("Vehicle capacity is required to create a captain");
  }
  if (!vehicle.vehicleType)
  {
    throw new Error("Vehicle type is required to create a captain");
  }
  const captain = captainModel.create({
    fullname: {
      firstname:fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password,
    vehicle: {
      colour: vehicle.colour,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    },
  });

  return captain;
};
