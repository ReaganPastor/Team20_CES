-- PostgreSQL schema for movies and showings (DDL)
-- schema.sql
DROP TABLE IF EXISTS showings;
DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL UNIQUE,
    description  TEXT NOT NULL,
    rating       VARCHAR(10) NOT NULL,
    genre        VARCHAR(50) NOT NULL,
    poster_path   TEXT NOT NULL,
    trailer_path  TEXT NOT NULL,
    status       VARCHAR(30) NOT NULL,

    CONSTRAINT check_movie_status CHECK (status IN ('Currently Running', 'Coming Soon')),
    
    CONSTRAINT check_movie_rating CHECK (rating IN ('G', 'PG', 'PG-13', 'R', 'NC-17'))
);

CREATE TABLE showings (
    id          BIGSERIAL PRIMARY KEY,
    movie_id     BIGINT NOT NULL,
    show_time    TIME NOT NULL,
    show_date    DATE NOT NULL,

    CONSTRAINT fk_showings_movie
    FOREIGN KEY (movie_id) REFERENCES movies(id) 
    ON DELETE CASCADE,

    -- prevent duplicate showing rows for the same movie at the same time and date
    CONSTRAINT unique_showing UNIQUE (movie_id, show_time, show_date)
);

-- Indexes for demo/search/filter speed
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_title_lower ON movies ((lower(title)));

CREATE INDEX idx_showings_movie_id ON showings(show_date);
CREATE INDEX idx_showings_show_time ON showings(movie_id);
CREATE INDEX idx_showings_show_date ON showings(movie_id, show_date);
