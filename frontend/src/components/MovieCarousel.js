import React, { useState } from "react";
import MovieCard from "./MovieCard";
import "./MovieCarousel.css";

function MovieCarousel({ movies, moviesPerPage = 6 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => setCurrentIndex(prev => Math.max(prev - moviesPerPage, 0));
  const handleNext = () =>
    setCurrentIndex(prev => Math.min(prev + moviesPerPage, movies.length - moviesPerPage));

  const visibleMovies = movies.slice(currentIndex, currentIndex + moviesPerPage);

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
        {visibleMovies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
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