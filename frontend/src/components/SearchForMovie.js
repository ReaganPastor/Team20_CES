import "./SearchForMovie.css";
import React, { useEffect, useState } from "react";

function SearchForMovie({ setMovies }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const resp = await fetch(
        `http://localhost:8080/movies/search?title=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await resp.json();
      setMovies(data); // update movies in HomePage
    } catch (err) {
      console.error("Error searching movies:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress} // press Enter to search
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchForMovie;