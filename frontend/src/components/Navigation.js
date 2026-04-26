import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import logo from "../icons/projectorLogo.png"; // <- correct import from src/icons

function Navigation() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/");
    };

    return(
        <header className="App-header">
            <div className="logo">
                <img
                    src={logo}  // <- use the imported logo
                    alt="CES Logo"
                    className="logo-img"
                />
                <div className="logo-text">
                    <span>Cinema</span>
                    <span>E-booking</span>
                    <span>System</span>
                </div>
            </div>

            <nav className="nav-tabs">
                <a href="" onClick={() => navigate("/")}>Movies</a>

                {localStorage.getItem("role") && (
                    <a href="" onClick={() => navigate("/edit-profile")}>Edit Profile</a>
                )}

                {localStorage.getItem("role") === "admin" && (
                    <a href="" onClick={() => navigate("/admin")}>Manage Movies</a>
                )}

                {localStorage.getItem("role") === "admin" && (
                    <a href="">Promotions</a>
                )}

                {localStorage.getItem("role") === "admin" && (
                    <a href="">Users</a>
                )}

                {localStorage.getItem("role") === "admin" && (
                    <a href="" onClick={() => navigate("/admin/showtimes")}>Showtimes</a>
                )}

                {(localStorage.getItem("role") === "user" || localStorage.getItem("role") === "admin") && (
                    <a href="" onClick={() => handleLogout()}>Logout</a>
                )}

                {!localStorage.getItem("role") && (
                    <a href="" onClick={() => navigate("/login")}>Login</a>
                )}
            </nav>
        </header>
    );
}

export default Navigation;