import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ViewDetails from "./components/ViewDetails";
import BookingPage from "./components/BookingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<ViewDetails />} />
        <Route path="/movies/:id/book" element={<BookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;