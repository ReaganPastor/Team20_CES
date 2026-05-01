import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./CheckoutPage.css";

const STORAGE_KEY = "pendingCheckout";

export default function CheckoutAuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutState = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }

    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }, [location.state]);

  useEffect(() => {
    if (!checkoutState) return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutState));

    const isLoggedIn =
      localStorage.getItem("token") ||
      localStorage.getItem("username") ||
      localStorage.getItem("userId");

    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: "/checkout",
          checkoutState: checkoutState,
        },
      });
      return;
    }

    navigate("/checkout", {
      state: checkoutState,
    });
  }, [checkoutState, navigate]);

  if (!checkoutState) {
    return (
      <div className="checkout-page">
        <Navigation />
        <div className="checkout-container">
          <div className="checkout-left">
            <h1>Checkout</h1>
            <p>No booking information found.</p>
            <button className="secondary-btn" onClick={() => navigate("/")}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navigation />
      <div className="checkout-container">
        <div className="checkout-left">
          <h1>Redirecting...</h1>
          <p>Checking your login before checkout.</p>
        </div>
      </div>
    </div>
  );
}