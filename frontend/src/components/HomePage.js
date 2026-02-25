import React, { useEffect, useState, useRef } from "react";
import "./FilterByGenre.css";
import MovieCard from "./MovieCard";
import Navigation from "./Navigation";
import SearchForMovie from "./SearchForMovie";

function HomePage() {
    const [message, setMessage] = useState(""); // state to store backend response
    const [movies, setMovies] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Returns html with layout of page, currently includes Backend Connection check, filters, and list of movies after filter - Reagan
    return (
        <div className="app-container">
            <Navigation />

<div className="filter-search-row">
    <SearchForMovie />

    <div className="genre-section">
        <div ref={dropdownRef} className="dropdown-container">
            {/* Dropdown Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="dropdown-button"
            >
                {selectedGenres.length === 0
                    ? "Filter by Genre"
                    : `${selectedGenres.length} Selected`}
                <span
                    className="dropdown-arrow"
                    style={{
                        transform: isOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)"
                    }}
                >
                    ▼
                </span>
            </div>

            {isOpen && (
                <div className="dropdown-menu">
                    {genres.map((genre) => (
                        <label
                            key={genre}
                            className={`genre-item ${
                                selectedGenres.includes(genre)
                                    ? "checked"
                                    : ""
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedGenres.includes(genre)}
                                onChange={() =>
                                    handleGenreChange(genre)
                                }
                            />
                            {genre}
                        </label>
                    ))}
                </div>
            )}
        </div>

        {/* Selected Pills */}
        <div className="selected-pills">
            {selectedGenres.length === 0 ? (
                <span className="no-movies">
                    None selected
                </span>
            ) : (
                selectedGenres.map((genre) => (
                    <div
                        key={genre}
                        className="pill"
                        onClick={() =>
                            handleGenreChange(genre)
                        }
                    >
                        {genre} ×
                    </div>
                ))
            )}
        </div>
    </div>
</div>

            <h2>Movies</h2>

            {loading ? (
            <p>Loading movies...</p>
            ) : movies.length === 0 ? (
            <p>No movies were found.</p>
            ) : (
            <>
            </>
            )}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
            {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
            </div>
        </div>
    );
}

export default HomePage;