import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import MovieCard from "../components/MovieCard";

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    address: { street: "", city: "", state: "", zipCode: "" },
  });
  const [newCard, setNewCard] = useState({ cardholderName: "", number: "", exp: "", cvv: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));

  // Fetch profile from backend
  const fetchProfile = async () => {
    if (!userId) {
      setError("No user ID found. Please login again.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to load profile (${res.status})`);
      }
      const data = await res.json();
      setProfile(data);
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
        address: data.address || { street: "", city: "", state: "", zipCode: "" },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchProfile();
  }, [token, userId]);

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Credit card formatting
  const formatCardNumber = (num) =>
    num.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExp = (exp) => {
    let cleaned = exp.replace(/\D/g, "");
    if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    return cleaned;
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "number") value = formatCardNumber(value);
    if (name === "exp") value = formatExp(value);
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setNewCard({ ...newCard, [name]: value });
  };

  const validateCard = () => {
    const { cardholderName, number, exp, cvv } = newCard;
    const numberValid = /^\d{4} \d{4} \d{4} \d{4}$/.test(number);
    const expValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
    const cvvValid = /^\d{3}$/.test(cvv);
    if (!cardholderName || !numberValid || !expValid || !cvvValid) {
      setCardError("Please enter card info correctly.");
      return false;
    }
    setCardError("");
    return true;
  };

  // Add payment card
  const handleAddCard = async () => {
    if ((profile.paymentCards || []).length >= 3) {
      setCardError("Maximum 3 cards allowed");
      return;
    }
    if (!validateCard()) return;

    try {
      const res = await fetch(`http://localhost:8080/profile/${userId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          cardholderName: newCard.cardholderName,
          cardNumber: newCard.number.replace(/\s/g, ""),
          expirationDate: newCard.exp,
          cvv: newCard.cvv,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to add card (${res.status})`);
      }
      const addedCard = await res.json();
      setProfile({
        ...profile,
        paymentCards: [...(profile.paymentCards || []), addedCard],
      });
      setNewCard({ cardholderName: "", number: "", exp: "", cvv: "" });
      setCardError("");
    } catch (err) {
      setCardError(err.message);
    }
  };

  // Remove payment card
  const handleRemoveCard = async (cardId) => {
    try {
      const res = await fetch(`http://localhost:8080/profile/${userId}/cards/${cardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to remove card (${res.status})`);
      setProfile({
        ...profile,
        paymentCards: profile.paymentCards.filter((c) => c.id !== cardId),
      });
    } catch (err) {
      setCardError(err.message);
    }
  };

  // Remove favorite movie
  const handleRemoveFavorite = (id) => {
    setProfile({ ...profile, favoriteMovies: profile.favoriteMovies.filter((m) => m.id !== id) });
  };

  // Save address separately
  const saveAddress = async () => {
    try {
      const res = await fetch(`http://localhost:8080/profile/${userId}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form.address),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to save address (${res.status})`);
      }
      const updatedAddress = await res.json();
      setProfile((prev) => ({ ...prev, address: updatedAddress }));
    } catch (err) {
      setError(err.message);
    }
  };

  // Save profile + address
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Update basic profile fields
      const res = await fetch(`http://localhost:8080/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to update profile (${res.status})`);
      }
      const updatedProfile = await res.json();

      // Update address
      await saveAddress();

      setProfile(updatedProfile);
      setMessage("Profile updated successfully!");
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  const maxCardsReached = (profile.paymentCards || []).length >= 3;

  return (
    <div className="profile-page">
      {/* Profile Info */}
      <div className="profile-card">
        <h2>Profile Info</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSave}>
          <input type="text" value={profile.username} disabled className="centered-input" />
          <input type="email" value={profile.email} disabled className="centered-input" />
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="centered-input" />
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="centered-input" />
          <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="centered-input" />
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Current Password" className="centered-input" />
          <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New Password" className="centered-input" />

          <h3>Address</h3>
          <input type="text" name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street" className="centered-input" />
          <input type="text" name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" className="centered-input" />
          <input type="text" name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" className="centered-input" />
          <input type="text" name="address.zipCode" value={form.address.zipCode} onChange={handleChange} placeholder="Zip Code" className="centered-input" />

          <button type="submit" className="save-button">Save Changes</button>
        </form>
      </div>

      {/* Payment Cards */}
      <div className="profile-card">
        <h2>Payment Cards (Max 3)</h2>
        {(profile.paymentCards || []).length === 0 && <p>No cards added</p>}
        <ul>
          {(profile.paymentCards || []).map((card) => (
            <li key={card.id}>
              {card.cardholderName} - **** **** **** {card.lastFour} 
              <button className="inline-button" onClick={() => handleRemoveCard(card.id)}>Remove</button>
            </li>
          ))}
        </ul>

        {!maxCardsReached && (
          <>
            <input
              type="text"
              name="cardholderName"
              value={newCard.cardholderName}
              onChange={handleCardChange}
              placeholder="Cardholder Name"
              className="centered-input"
            />
            <input
              type="text"
              name="number"
              value={newCard.number}
              onChange={handleCardChange}
              placeholder="Card Number"
              className="centered-input"
              maxLength={19}
            />
            <input
              type="text"
              name="exp"
              value={newCard.exp}
              onChange={handleCardChange}
              placeholder="MM/YY"
              className="centered-input"
              maxLength={5}
            />
            <input
              type="password"
              name="cvv"
              value={newCard.cvv}
              onChange={handleCardChange}
              placeholder="CVV"
              className="centered-input"
              maxLength={3}
            />
            {cardError && <p className="error">{cardError}</p>}
            <button className="small-button" onClick={handleAddCard}>Add Card</button>
          </>
        )}

        {/* Max cards reached message */}
        {maxCardsReached && (
          <p style={{ color: "#f87171", fontSize: "13px", marginTop: "4px" }}>
            Maximum 3 cards allowed
          </p>
        )}
      </div>

      {/* Favorite Movies */}
      <div className="profile-card">
        <h2>Favorite Movies</h2>
        {(profile.favoriteMovies || []).length === 0 && <p>No favorites yet</p>}
        <div className="movie-grid">
          {(profile.favoriteMovies || []).map((movie) => (
            <MovieCard key={movie.id} movie={movie}>
              <button className="inline-button" onClick={() => handleRemoveFavorite(movie.id)}>Remove</button>
            </MovieCard>
          ))}
        </div>
      </div>

      {/* Go Back */}
      <button className="save-button" style={{ maxWidth: "350px", marginTop: "20px" }} onClick={() => navigate("/")}>
        Go Back to Homepage
      </button>
    </div>
  );
}