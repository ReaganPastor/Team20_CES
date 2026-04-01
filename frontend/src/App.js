import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ViewDetails from "./components/ViewDetails";
import BookingPage from "./components/BookingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EditProfile from "./components/EditProfile";
import EmailVerified from "./components/EmailVerified";
import ResetPassword from "./components/ResetPassword";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/movies/:id" element={<ViewDetails />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/movies/:id/book" element={<BookingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;