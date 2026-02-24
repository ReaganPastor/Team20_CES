//import React from "react";
import "./SearchForMovie.css";
import React, { useEffect, useState } from "react";

function SearchForMovie() {

    const [searchTerm, setSearchTerm] = useState("");

    return(
        <div>
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
        </div>
    );
}

export default SearchForMovie;