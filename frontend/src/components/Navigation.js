import React from "react";
import "./Navigation.css";

function Navigation() {
    return(
        <div>
            {/* HEADER */}
            <header className="App-header">
                <div className="logo">
                <img
                    src="../icons/projectorLogo.png"
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
                <a href="#">Movies</a>
                <a href="#">Promotions</a>
                <a href="#">Sign Up / Login</a>
                </nav>
            </header>
        </div>
    );

}

export default Navigation;