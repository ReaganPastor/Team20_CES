import React from "react";
import "./MovieCard.css";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

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
            // Fall back to default image if poster fails to load
            if (e.target.src !== "../icons/NoPoster.png") {
              e.target.src = "../icons/NoPoster.png";
            }
        }}
        style={{ width: "100%", height: "285px", borderRadius: "8px" }} 
      />
      <h2 style={{ fontSize: "18px" }}>{movie.title}</h2>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      {/*<p><strong>Duration:</strong> {movie.durationMinutes} min</p> */}{/* ADDED duration */}
      <button class="view-details-btn" onClick={() => navigate(`/movies/${movie.id}`)}>View Details</button>

      {localStorage.getItem("role") === "user" && (
        <button>❤️ Favorite</button>
      )}

      {localStorage.getItem("role") === "admin" && (
        <button>✏️ Edit</button>
      )}

    </div>
  );
}

export default MovieCard;