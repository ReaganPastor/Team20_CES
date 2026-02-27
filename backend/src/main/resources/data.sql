-- Seed data for 10+ movies using local React public assets
-- Posters live at: frontend/public/posters/
-- Trailers live at: frontend/public/trailers/
-- DB should store web paths like /posters/movie1.jpg and /trailers/movie1.mp4
-- data.sql
INSERT INTO movies (title, description, rating, genre, poster_path, trailer_path, status) VALUES
('Interstellar', 'A team travels through a wormhole in space to ensure humanity''s survival.', 'PG-13', 'Sci-Fi', '/posters/Interstellar.jpeg', '/trailers/Intersellar_Trailer.mp4', 'Currently Running'),

('The Dark Knight', 'Batman faces the Joker, a criminal mastermind causing chaos in Gotham City.', 'PG-13', 'Action', '/posters/The_Dark_Knight.jpeg', '/trailers/Dark_Knight_Trailer.mp4', 'Currently Running'),

('Jaws', 'A great white shark terrorizes a beach town, forcing an unlikely team to hunt it.', 'PG', 'Thriller', '/posters/Jaws.jpeg', '/trailers/Jaws_Trailer.mp4', 'Currently Running'),

('Titanic', 'A romance unfolds aboard the ill-fated Titanic.', 'PG-13', 'Romance', '/posters/Titanic.jpeg', '/trailers/Titanic_Trailer.mp4', 'Currently Running'),

('The Matrix', 'A hacker discovers reality is a simulation and joins a rebellion.', 'R', 'Sci-Fi', '/posters/The_Matrix.jpeg', '/trailers/Matrix_Trailer.mp4', 'Currently Running'),

('Avengers: Endgame', 'The Avengers assemble for one final stand to undo catastrophic events.', 'PG-13', 'Action', '/posters/Avengers_Endgame.jpeg', '/trailers/Avengers_Endgame_Trailer.mp4', 'Coming Soon'),

('Dirty Dancing', 'A coming-of-age story set to unforgettable music and dance.', 'PG-13', 'Drama', '/posters/Dirty_Dancing.jpeg', '/trailers/Dirty_Dancing_Trailer.mp4', 'Coming Soon'),

('The Lion King', 'A young lion prince learns what it means to be a king.', 'G', 'Animation', '/posters/The_Lion_King.jpeg', '/trailers/Lion_King_Trailer.mp4', 'Coming Soon'),

('Cinderella', 'A classic fairy tale of kindness, courage, and transformation.', 'G', 'Family', '/posters/Cinderella.jpeg', '/trailers/Cinderella_Trailer.mp4', 'Coming Soon'),

('Cars', 'A race car learns humility and friendship in a small town.', 'G', 'Animation', '/posters/Cars.jpeg', '/trailers/Cars_1_Trailer.mp4', 'Coming Soon');



-- Showings (3 Showings per movie, across multiple dates for filter demo)
-- NOTE: This pattern inserts showings for ALL movies.

INSERT INTO showings (movie_id, show_date, show_time)
SELECT id, DATE '2026-03-07', TIME '14:00'
FROM movies;
INSERT INTO showings (movie_id, show_date, show_time)
SELECT id, DATE '2026-03-07', TIME '17:00' 
FROM movies;
INSERT INTO showings (movie_id, show_date, show_time)
SELECT id, DATE '2026-03-07', TIME '20:00'
FROM movies;

INSERT INTO showings (movie_id, show_date, show_time)
SELECT id, DATE '2026-03-08', TIME '14:00'
FROM movies;
INSERT INTO showings (movie_id, show_date, show_time)
SELECT id, DATE '2026-03-08', TIME '17:00' 
FROM movies;
INSERT INTO showings (movie_id, show_date, show_time)
SELECT id, DATE '2026-03-08', TIME '20:00'

FROM movies;