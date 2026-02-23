import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState(""); // state to store backend response
  
  const [movies, setMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const genres = ["Sci-Fi", "Romance", "Thriller", "Crime", "Genre with No Movies"];

  useEffect(() => {
    fetch("http://localhost:8080/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Error connecting to backend"));
  }, []);

  // Creates query to fetch movies by genre - Reagan
  const getMoviesByGenres = async (genres) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  // Returns html with layout of page, currently includes Backend Connection check, filters, and list of movies after filter - Reagan
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Movie Booking App Frontend!!</h1>
      <p>Backend says: {message}</p>

      <h2>Select Genres</h2>
      {genres.map((genre) => (
        <label key={genre} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedGenres.includes(genre)}
            onChange={() => handleGenreChange(genre)}
          />
          {genre}
        </label>
      ))}

      <h2>Movies</h2>

      {loading ? (
      <p>Loading movies...</p>
      ) : movies.length === 0 ? (
      <p>No movies were found.</p>
      ) : (
      <>
        <p>Number of Movies: {movies.length}</p>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.title} - {movie.genre}
            </li>
          ))}
        </ul>
      </>
)}
    </div>
  );
}

export default App;
