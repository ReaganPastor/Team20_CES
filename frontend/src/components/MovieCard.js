import React, { useState, useEffect } from "react";
import "./MovieCard.css";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, isFavorite, onFavoriteToggle }) {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(isFavorite || false);

  const handleFavoriteClick = async () => {
    try {
      await onFavoriteToggle(movie, !favorited); // call parent handler
      setFavorited(!favorited);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "16px",
        margin: "10px",
        width: "200px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img 
        src={movie.poster_path} 
        alt={movie.title}
        onError={(e) => {
          if (e.target.src !== "../icons/NoPoster.png") e.target.src = "../icons/NoPoster.png";
        }}
        style={{ width: "100%", height: "285px", borderRadius: "8px" }} 
      />
      <h2 style={{ fontSize: "18px" }}>{movie.title}</h2>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>

      <button className="view-details-btn" onClick={() => navigate(`/movies/${movie.id}`)}>View Details</button>

      {localStorage.getItem("role") === "user" && (
        <button 
          onClick={handleFavoriteClick} 
          style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}
        >
          {favorited ? "❤️" : "🤍"}
        </button>
      )}

      {localStorage.getItem("role") === "admin" && (
        <button>✏️ Edit</button>
      )}
    </div>
  );
}

export default MovieCard;