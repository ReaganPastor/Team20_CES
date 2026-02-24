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
        src={movie.posterUrl}
        alt={movie.title}
        style={{ width: "100%", borderRadius: "8px" }}
    />
      <h2 style={{ fontSize: "18px" }}>{movie.title}</h2>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <button class="view-details-btn" onClick={() => navigate(`/movies/${movie.id}`)}>View Details</button>
    </div>
  );
}

export default MovieCard;