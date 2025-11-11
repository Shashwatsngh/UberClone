import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      email: email,
      password: password,
    });
    console.log(userData);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };
  return (
    <div className="flex flex-col items-center h-screen w-full p-2">
      <img
        className="logo w-16 m-6 self-start"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <form
        onSubmit={(e) => {
          submitHandler(e);
        }}
        className="flex flex-col items-center w-full p-4 gap-4"
      >
        {/* <h1 className="font-bold text-xl self-start">Sign Up</h1> */}
        {/* first name and last name */}
        <div className="w-full">
          <h2 className="text-xl font-semibold self-start">What's your name</h2>
          <div className="flex w-full justify-between gap-2">
            <input
              type="text"
              className="w-1/2 bg-[#EFF0EE] p-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              className="w-1/2 bg-[#EFF0EE] p-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* email */}
        <div className="w-full">
          <h2 className="text-xl font-semibold self-start">
            What's your email
          </h2>
          <input
            type="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="bg-[#EFF0EE] p-2 w-full"
          />
        </div>

        {/* password */}
        <div className="w-full">
          <h2 className="text-xl font-semibold self-start">Enter password</h2>
          <input
            type="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="bg-[#EFF0EE] p-2 w-full"
          />
        </div>

        {/* submit */}
        <button
          type="submit"
          className="bg-black text-white p-2 w-full font-semibold text-xl"
        >
          Sign Up
        </button>
        <p className="mt-2">
          Already a user?{" "}
          <Link to="/userLogin" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>

      <Link
        to="/captainSignUp"
        className="bg-gray-400 text-black p-2 w-[90%] mx-auto flex items-center justify-center mt-auto font-semibold text-xl rounded mb-6"
      >
        Register as a Captain
      </Link>
    </div>
  );
};

export default UserSignUp;
