import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState(""); // state to store backend response
  
  const [movies, setMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const genres = ["Sci-Fi", "Romance", "Thriller", "Crime"];

  useEffect(() => {
    fetch("http://localhost:8080/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Error connecting to backend"));
  }, []);

  // Creates query to fetch movies by genre - Reagan
  const getMoviesByGenres = async (genres) => {
    try {
      // Build query string to properly for list
      const query = genres.map((g) => `genres=${encodeURIComponent(g)}`)
      .join("&");

      // Fetch response from the backend
      const resp = await fetch(`http://localhost:8080/movies${query ? `?${query}` : ""}`);

      // Get JSON response
      const data = await resp.json();

      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  // Calls getMoviesByGenre when effect occurs - Reagan
  useEffect(() => {
    getMoviesByGenres(selectedGenres);
  }, [selectedGenres]);

  // Adds selected genres to list - Reagan
  const handleGenreChange = (genre) => {
    setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g != genre) : [...prev, genre]);
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to generate random positions and rotations for background icons - Obi
  const backgroundIcons = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    src: ['/icons/clapperboard.png', '/icons/projector.png', '/icons/tape-recorder.png'][i % 3],
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    rotation: `${Math.random() * 360}deg`,
  }));

  // Returns html with layout of page, currently includes Backend Connection check, filters, and list of movies after filter - Reagan
  return (
    /** ======================== NEW HOMEPAGE LAYOUT BELOW - OBI ==================== **/ 
    <div className="App"> 
      {/* BACKGROUND ICONS SO THEY ARE LIKE POKA DOTS */}
      <div className="background-overlay">
        {backgroundIcons.map((icon) => (
          <img
            key={icon.id}
            src={icon.src}
            alt=""
            className="bg-icon"
            style={{
              top: icon.top,
              left: icon.left,
              transform: `rotate(${icon.rotation})`,
            }}
          />
        ))}
      </div>
      {/* HEADER */}
      <header className="App-header">
        <div className="logo">
          <img
            src="/icons/projectorLogo.png"
            alt="CES Logo"
            className="logo-img"
          />
        <div className="logo-text">
          <span>Cinema</span>
          <span>E-booking</span>
          <span>System</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <a href="#">Movies</a>
          <a href="#">Promotions</a>
          <a href="#">Sign Up / Login</a>
        </nav>
      </header>

      {/* SEARCH BAR */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>Search</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <p className="backend-status">Backend says: {message}</p>

        <h2>Select Genres</h2>
        <div className="genres">
          {genres.map((genre) => (
            <label key={genre}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
              />
              {genre}
            </label>
          ))}
        </div>

        <h2>Movies</h2>
        <p>Number of Movies: {filteredMovies.length}</p>

        <ul className="movie-list">
          {filteredMovies.map((movie) => (
            <li key={movie.id}>
              {movie.title} - {movie.genre}
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
}

export default App;
