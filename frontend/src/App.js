import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ViewDetails from "./components/ViewDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<ViewDetails />} />
      </Routes>
    </Router>
  );
}

export default App;