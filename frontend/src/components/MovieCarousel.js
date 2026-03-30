import React, { useState } from "react";
import MovieCard from "./MovieCard";
import "./MovieCarousel.css";

function MovieCarousel({ movies, moviesPerPage = 6 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - moviesPerPage, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + moviesPerPage, movies.length - moviesPerPage)
    );
  };

  const visibleMovies = movies.slice(
    currentIndex,
    currentIndex + moviesPerPage
  );

  // ⭐ Favorite handler
  const handleFavoriteToggle = async (movie) => {
    if (!token || !userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/profile/${userId}/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(movie),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to favorite movie (${res.status})`);
      }

      console.log(`Added to favorites: ${movie.title}`);
    } catch (err) {
      console.error("Favorite error:", err.message);
    }
  };

  return (
    <div className="carousel-container">
      {/* Left Arrow */}
      <button
        className="carousel-arrow left-arrow"
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        ◀
      </button>

      {/* Movie Cards */}
      <div className="carousel-cards">
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>

      {/* Right Arrow */}
      <button
        className="carousel-arrow right-arrow"
        onClick={handleNext}
        disabled={currentIndex + moviesPerPage >= movies.length}
      >
        ▶
      </button>
    </div>
  );
}

export default MovieCarousel;