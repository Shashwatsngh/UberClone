import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import UserLogin from "./pages/userLogin.jsx";
import UserSignUp from "./pages/userSignUp.jsx";
import CaptainLogin from "./pages/captainLogin.jsx";
import CaptainSignUp from "./pages/captainSignUp.jsx";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/userSignUp" element={<UserSignUp />} />
        <Route path="/captainLogin" element={<CaptainLogin />} />
        <Route path="/captainSignUp" element={<CaptainSignUp />} />
      </Routes>
    </div>
  );
};

export default App;
