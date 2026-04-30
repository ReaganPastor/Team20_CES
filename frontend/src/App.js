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
import AdminHome from "./components/AdminHome";
import AddMovie from "./components/AddMovie";
import AddShowtime from "./components/AddShowtime";
import CheckoutPage from "./components/CheckoutPage";
import GuestCheckoutPage from "./components/GuestCheckoutPage";
import ChangePassword from "./components/ChangePassword";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import OrderHistoryPage from "./components/OrderHistoryPage";

function App() {
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
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/add-movie" element={<AddMovie />} />
        <Route path="/admin/showtimes" element={<AddShowtime />} />
        <Route path="/guest-checkout" element={<GuestCheckoutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;