import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import logo from "../icons/projectorLogo.png";

function Navigation() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="App-header">
      <div className="logo">
        <img src={logo} alt="CES Logo" className="logo-img" />

        <div className="logo-text">
          <span>Cinema</span>
          <span>E-booking</span>
          <span>System</span>
        </div>
      </div>

      <nav className="nav-tabs">
        <div className="nav-center">
          <button onClick={() => navigate("/")}>Movies</button>

          {role && (
            <button onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
          )}

          {role && (
            <button onClick={() => navigate("/order-history")}>
              Order History
            </button>
          )}

          {role === "admin" && (
            <button onClick={() => navigate("/admin")}>
              Manage Movies
            </button>
          )}

          {role === "admin" && (
            <button onClick={() => navigate("/admin/promotions")}>
              Promotions
            </button>
          )}

          {role === "admin" && (
            <button onClick={() => navigate("/admin/users")}>
              Users
            </button>
          )}

          {role === "admin" && (
            <button onClick={() => navigate("/admin/showtimes")}>
              Showtimes
            </button>
          )}
        </div>

        <div className="nav-right">
          {(role === "user" || role === "admin") && (
            <button onClick={handleLogout}>Logout</button>
          )}

          {!role && (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navigation;