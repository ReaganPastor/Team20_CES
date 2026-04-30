import React, { useEffect, useState, useRef } from "react";
import "./FilterByGenre.css";
import MovieCarousel from "./MovieCarousel";
import Navigation from "./Navigation";
import SearchForMovie from "./SearchForMovie";
import ShowDatesFilter from "./ShowDateFilter";

function HomePage() {
    const [movies, setMovies] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [genres, setGenres] = useState([]);

    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const resp = await fetch("http://localhost:8080/movies/genres");
                const data = await resp.json();
                setGenres(data);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);

    const getMoviesByGenres = async (genres) => {
        try {
            setLoading(true);

            const query = genres
                .map(g => `genre=${encodeURIComponent(g)}`)
                .join("&");

            const resp = await fetch(
                `http://localhost:8080/movies${query ? `?${query}` : ""}`
            );

            const data = await resp.json();
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMoviesByGenres(selectedGenres);
    }, [selectedGenres]);

    const handleGenreChange = (genre) => {
        setSelectedGenres((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = chatInput;

        setChatMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setChatInput("");
        setChatLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await res.json();

            setChatMessages(prev => [
                ...prev,
                { role: "ai", text: data.reply }
            ]);

        } catch (err) {
            setChatMessages(prev => [
                ...prev,
                { role: "ai", text: "Error contacting AI." }
            ]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleDateChange = (start, end) => {
        console.log(start, end);
    };

    const currentlyRunningMovies = movies.filter(
        (m) => m.status === "CURRENTLY_RUNNING"
    );

    const comingSoonMovies = movies.filter(
        (m) => m.status === "COMING_SOON"
    );

    return (
        <div className="page-layout">

            {/* LEFT SIDE */}
            <div className="main-content">
                <Navigation />

                <div className="filter-search-row">
                    <SearchForMovie setMovies={setMovies} />

                    <div className="genre-section">
                        <div ref={dropdownRef} className="dropdown-container">

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
                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
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
                                                selectedGenres.includes(genre) ? "checked" : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedGenres.includes(genre)}
                                                onChange={() => handleGenreChange(genre)}
                                            />
                                            {genre}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="selected-pills">
                            {selectedGenres.length === 0 ? (
                                <span className="no-movies">No Genre Selected</span>
                            ) : (
                                selectedGenres.map((genre) => (
                                    <div
                                        key={genre}
                                        className="pill"
                                        onClick={() => handleGenreChange(genre)}
                                    >
                                        {genre} ×
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <ShowDatesFilter onChange={handleDateChange} />
                </div>

                {loading && <p className="loading-text">Loading movies...</p>}

                <h2>Currently Running</h2>
                <MovieCarousel
                    movies={currentlyRunningMovies}
                    moviesPerPage={6}
                />

                <h2>Coming Soon</h2>
                <MovieCarousel
                    movies={comingSoonMovies}
                    moviesPerPage={6}
                />
            </div>
            {/* RIGHT SIDE CHAT */}
            {chatOpen && (
                <div className="chat-sidebar">
                    <div className="chat-container">
                        <h2>AI Assistant</h2>

                        <div className="chat-box">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`chat-message ${msg.role}`}>
                                    {msg.text}
                                </div>
                            ))}

                            {chatLoading && (
                                <div className="chat-message ai">Typing...</div>
                            )}
                        </div>

                        <div className="chat-input-row">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask about movies..."
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />

                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="chat-toggle-btn"
                onClick={() => setChatOpen(!chatOpen)}
            >
                {chatOpen ? "Close Chat" : "Open Chat"}
            </button>
        </div>
    );
}

export default HomePage;