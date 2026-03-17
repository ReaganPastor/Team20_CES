import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import logo from "../icons/projectorLogo.png"; // <- correct import from src/icons

function Navigation() {
    const navigate = useNavigate();

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
                <a href="#" onClick={() => navigate("/")}>Movies</a>
                <a href="#">Promotions</a>
                <a href="#" onClick={() => navigate("/login")}>Login</a>
            </nav>
        </header>
    );
}

export default Navigation;