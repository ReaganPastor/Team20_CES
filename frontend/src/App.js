import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ViewDetails from "./components/ViewDetails";
import BookingPage from "./components/BookingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";


import BookingPage from "./components/BookingPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/movies/:id" element={<ViewDetails />} />        
        <Route path="/booking" element={<BookingPage />} /> 
=======
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/movies/:id" element={<ViewDetails />} />
        <Route path="/movies/:id/book" element={<BookingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
>>>>>>> main
      </Routes>
    </Router>
  );
}

export default App;