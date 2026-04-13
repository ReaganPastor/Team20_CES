import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div>
      <Navigation />
      <div className="login-page">
        <div className="login-card">
          <h2>Admin Home</h2>
          <div className="button-row horizontal-buttons">
            <button onClick={() => navigate("/admin/add-movie")}>
              Add Movie
            </button>
            <button onClick={() => navigate("/admin/showtimes")}>
              Schedule Showtime
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;