import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "./MovieCarousel.css";

// MovieCarousel shows multiple movies + handles backend logic
function MovieCarousel({ movies, moviesPerPage = 6 }) {

  // Track where we are in carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Store IDs of favorited movies
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Get user info from localStorage
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  // Load favorites from backend when page loads
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token || !userId || role !== "user") return;

      try {
        const res = await fetch(
          `http://localhost:8080/profile/${userId}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await res.json();

        // Save only IDs for easy checking
        setFavoriteIds(data.map((movie) => movie.id));
      } catch (err) {
        console.error("Error loading favorites:", err.message);
      }
    };

    fetchFavorites();
  }, [token, userId, role]);

  // Move left
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - moviesPerPage, 0));
  };

  // Move right
  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + moviesPerPage, Math.max(movies.length - moviesPerPage, 0))
    );
  };

  // Main favorite function (connects to backend)
  const handleFavoriteToggle = async (movie, shouldFavorite) => {
    if (!token || !userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Decide API endpoint
      const url = shouldFavorite
        ? `http://localhost:8080/profile/${userId}/favorites` // add
        : `http://localhost:8080/profile/${userId}/favorites/${movie.id}`; // remove

      const options = {
        method: shouldFavorite ? "POST" : "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // If adding → send movie data
      if (shouldFavorite) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(movie);
      }

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error("Favorite request failed");
      }

      // Update UI instantly
      setFavoriteIds((prev) =>
        shouldFavorite
          ? [...new Set([...prev, movie.id])] // add
          : prev.filter((id) => id !== movie.id) // remove
      );

    } catch (err) {
      console.error("Favorite error:", err.message);
    }
  };

  // Movies currently visible
  const visibleMovies = movies.slice(
    currentIndex,
    currentIndex + moviesPerPage
  );

  return (
    <div className="carousel-container">

      {/* Left Button */}
      <button
        className="carousel-arrow left-arrow"
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        ◀
      </button>

      {/* Movie List */}
      <div className="carousel-cards">
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}

            // tells MovieCard if it's already favorited
            isFavorite={favoriteIds.includes(movie.id)}

            // sends toggle function to MovieCard
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>

      {/* Right Button */}
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