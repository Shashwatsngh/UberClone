import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({ email: email, password: password });
    console.log(userData);
    setEmail("");
    setPassword("");
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
          Log In
        </button>
        <p className="mt-2">
          Register a Captain?{" "}
          <Link to="/captainSignUp" className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </form>

      <Link
        to="/userLogin"
        className="bg-gray-400 text-black p-2 w-[90%] mx-auto flex items-center justify-center mt-auto font-semibold text-xl rounded mb-6"
      >
        Login as a User
      </Link>
    </div>
  );
};

export default CaptainLogin;
