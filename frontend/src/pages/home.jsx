import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container bg-[url('https://images.unsplash.com/photo-1557404763-69708cd8b9ce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhZmZpYyUyMGxpZ2h0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900')] bg-cover bg-center flex flex-col justify-between  h-screen w-full ">
      <img
        className="logo w-16 m-8"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="w-full flex flex-col items-center bg-white p-6 ">
        <h2 className="text-2xl w-full font-bold">Get Started with Uber</h2>
        <Link to="/userLogin" className="flex items-center justify-center text-white bg-black p-3 text-2xl rounded w-full my-2">
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Home;
