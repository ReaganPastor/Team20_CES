import React, { useState, useEffect } from "react";
import "./MovieCard.css";
import { useNavigate } from "react-router-dom";

// MovieCard displays ONE movie and handles favorite button UI
function MovieCard({ movie, isFavorite = false, onFavoriteToggle }) {
  const navigate = useNavigate();

  // Local state to track if THIS movie is favorited
  const [favorited, setFavorited] = useState(isFavorite);

  // Sync local state when parent updates favorites
  useEffect(() => {
    setFavorited(isFavorite);
  }, [isFavorite]);

  // Runs when user clicks favorite button
  const handleFavoriteClick = async () => {
    if (!onFavoriteToggle) return;

    try {
      // Flip current state (add OR remove)
      const nextValue = !favorited;

      // Tell MovieCarousel to update backend
      await onFavoriteToggle(movie, nextValue);

      // Update button UI
      setFavorited(nextValue);
    } catch (err) {
      console.error("Favorite toggle failed:", err);
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
      {/* Movie Poster */}
      <img
        src={movie.poster_path}
        alt={movie.title}
        onError={(e) => {
          // If image fails, use fallback
          if (e.target.src !== "../icons/NoPoster.png") {
            e.target.src = "../icons/NoPoster.png";
          }
        }}
        style={{ width: "100%", height: "285px", borderRadius: "8px" }}
      />

      {/* Movie Info */}
      <h2 style={{ fontSize: "18px" }}>{movie.title}</h2>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>

      {/* View Details Button */}
      <button
        className="view-details-btn"
        onClick={() => navigate(`/movies/${movie.id}`)}
      >
        View Details
      </button>

      {/* Favorite Button (ONLY for users) */}
      {localStorage.getItem("role") === "user" && (
        <button
          className={`favorite-btn ${favorited ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
        >
          {favorited ? "❤️ Favorited" : "🤍 Favorite"}
        </button>
      )}

      {/* Admin Edit Button */}
      {localStorage.getItem("role") === "admin" && (
        <button>✏️ Edit</button>
      )}
    </div>
  );
}

export default MovieCard;

