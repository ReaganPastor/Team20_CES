import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import MovieCard from "../components/MovieCard";

export default function EditProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));

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

  // --- FETCH PROFILE ---
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
      if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
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

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else setForm({ ...form, [name]: value });
  };

  // --- FAVORITE TOGGLE ---
  const handleFavoriteToggle = async (movie, shouldAdd) => {
    try {
      const url = `http://localhost:8080/profile/${userId}/favorites${shouldAdd ? "" : `/${movie.id}`}`;
      const res = await fetch(url, {
        method: shouldAdd ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: shouldAdd ? JSON.stringify({ id: movie.id, ...movie }) : undefined,
      });

      if (!res.ok) throw new Error("Failed to toggle favorite");

      // Update local state immediately
      setProfile((prev) => {
        const currentFavorites = prev.favoriteMovies || [];
        return {
          ...prev,
          favoriteMovies: shouldAdd
            ? [...currentFavorites, movie]
            : currentFavorites.filter((m) => m.id !== movie.id),
        };
      });
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleRemoveFavorite = (movie) => handleFavoriteToggle(movie, false);

  // --- SAVE PROFILE ---
  const saveAddress = async () => {
    try {
      const res = await fetch(`http://localhost:8080/profile/${userId}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form.address),
      });
      if (!res.ok) throw new Error(`Failed to save address (${res.status})`);
      const updatedAddress = await res.json();
      setProfile((prev) => ({ ...prev, address: updatedAddress }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
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
      if (!res.ok) throw new Error(`Failed to update profile (${res.status})`);
      await saveAddress();
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
      {/* LEFT SIDE: Edit Profile */}
      <div className="profile-card" style={{ flex: 1, maxWidth: "400px" }}>
        <h2>Edit Profile</h2>
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

      {/* RIGHT SIDE: Payment Cards */}
      <div className="profile-card" style={{ flex: 1, maxWidth: "400px" }}>
        <h2>Payment Methods</h2>
        {cardError && <p className="error">{cardError}</p>}
        {(profile.paymentCards || []).map((card) => (
          <div key={card.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{card.cardholderName} •••• {card.lastFour} ({card.expirationDate})</span>
            <button className="inline-button" onClick={async () => {
              try {
                const res = await fetch(`http://localhost:8080/profile/${userId}/cards/${card.id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to remove card");
                setProfile(prev => ({
                  ...prev,
                  paymentCards: prev.paymentCards.filter(c => c.id !== card.id)
                }));
              } catch (err) {
                setCardError(err.message);
              }
            }}>Remove</button>
          </div>
        ))}
        {!maxCardsReached && (
          <form style={{ marginTop: "10px" }} onSubmit={async (e) => {
            e.preventDefault();
            setCardError("");
            try {
              const res = await fetch(`http://localhost:8080/profile/${userId}/cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  cardholderName: newCard.cardholderName,
                  cardNumber: newCard.number,
                  expirationDate: newCard.exp,
                  cvv: newCard.cvv
                }),
              });
              if (!res.ok) throw new Error("Failed to add card");
              const addedCard = await res.json();
              setProfile(prev => ({
                ...prev,
                paymentCards: [...prev.paymentCards, addedCard]
              }));
              setNewCard({ cardholderName: "", number: "", exp: "", cvv: "" });
            } catch (err) {
              setCardError(err.message);
            }
          }}>
            <input type="text" placeholder="Cardholder Name" value={newCard.cardholderName} onChange={e => setNewCard({...newCard, cardholderName: e.target.value})} className="centered-input"/>
            <input type="text" placeholder="Card Number" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} className="centered-input"/>
            <input type="text" placeholder="Exp Date" value={newCard.exp} onChange={e => setNewCard({...newCard, exp: e.target.value})} className="centered-input"/>
            <input type="text" placeholder="CVV" value={newCard.cvv} onChange={e => setNewCard({...newCard, cvv: e.target.value})} className="centered-input"/>
            <button type="submit" className="save-button">Add Card</button>
          </form>
        )}
      </div>

      {/* FAVORITE MOVIES (horizontal scroll) */}
      <div className="profile-card" style={{ width: "100%", overflowX: "auto" }}>
        <h2>Favorite Movies</h2>
        {(profile.favoriteMovies || []).length === 0 && <p>No favorites yet</p>}
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" }}>
          {(profile.favoriteMovies || []).map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            >
              <button className="inline-button" onClick={() => handleRemoveFavorite(movie)}>Remove</button>
            </MovieCard>
          ))}
        </div>
      </div>

      <button className="save-button" style={{ maxWidth: "350px", marginTop: "20px" }} onClick={() => navigate("/")}>
        Go Back to Homepage
      </button>
    </div>
  );
}