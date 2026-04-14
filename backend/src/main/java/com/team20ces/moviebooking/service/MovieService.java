package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.model.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final JdbcTemplate jdbcTemplate;

    public MovieService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Maps one SQL row from the movies table into a Movie object.
     * Important: this now includes duration_mins.
     */
    private final RowMapper<Movie> movieRowMapper = (rs, rowNum) ->
            new Movie(
                    rs.getLong("id"),
                    rs.getString("title"),
                    rs.getString("description"),
                    rs.getString("rating"),
                    rs.getString("genre"),
                    rs.getString("poster_path"),
                    rs.getString("trailer_path"),
                    rs.getString("status"),
                    rs.getInt("duration_mins")
            );

    /**
     * Get all movies, with optional filters for status and genre.
     */
    public List<Movie> getAll(Optional<String> status, List<String> genres) {

        StringBuilder sql = new StringBuilder("SELECT * FROM movies WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (status.isPresent() && !status.get().isBlank()) {
            sql.append(" AND status = ?");
            params.add(status.get());
        }

        if (genres != null && !genres.isEmpty()) {
            sql.append(" AND genre IN (");

            for (int i = 0; i < genres.size(); i++) {
                sql.append("?");
                if (i < genres.size() - 1) {
                    sql.append(",");
                }
                params.add(genres.get(i));
            }

            sql.append(")");
        }

        return jdbcTemplate.query(sql.toString(), movieRowMapper, params.toArray());
    }

    /**
     * Get one movie by ID.
     */
    public Optional<Movie> getById(Long id) {
        String sql = "SELECT * FROM movies WHERE id = ?";

        List<Movie> results = jdbcTemplate.query(sql, movieRowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Search movies by title using a case-insensitive partial match.
     * Optional status filter is also supported.
     */
    public List<Movie> searchByTitle(String title, Optional<String> status) {

        StringBuilder sql =
                new StringBuilder("SELECT * FROM movies WHERE LOWER(title) LIKE LOWER(?)");

        List<Object> params = new ArrayList<>();
        params.add("%" + title + "%");

        if (status.isPresent() && !status.get().isBlank()) {
            sql.append(" AND status = ?");
            params.add(status.get());
        }

        return jdbcTemplate.query(
                sql.toString(),
                movieRowMapper,
                params.toArray()
        );
    }

    /**
     * Returns all distinct genres from the movies table.
     */
    public List<String> getAllGenres() {
        String sql = "SELECT DISTINCT genre FROM movies ORDER BY genre";
        return jdbcTemplate.queryForList(sql, String.class);
    }

    /**
     * Checks whether a movie with the same title already exists.
     * This helps prevent accidental duplicates.
     */
    public boolean existsByTitle(String title) {
        String sql = "SELECT COUNT(*) FROM movies WHERE LOWER(title) = LOWER(?)";

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, title);
        return count != null && count > 0;
    }

    /**
     * Add a new movie and return the saved movie with generated ID.
     * Important: this now inserts duration_mins too.
     */
    public Movie addMovie(Movie movie) {
        String sql = "INSERT INTO movies " +
                "(title, description, rating, genre, poster_path, trailer_path, status, duration_mins) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *";

        return jdbcTemplate.queryForObject(
                sql,
                movieRowMapper,
                movie.getTitle(),
                movie.getDescription(),
                movie.getRating(),
                movie.getGenre(),
                movie.getPosterPath(),
                movie.getTrailerPath(),
                movie.getStatus(),
                movie.getDurationMinutes()
        );
    }

    /**
     * Delete a movie by ID.
     * Returns true if deleted, false if no matching movie was found.
     */
    public boolean deleteMovie(Long id) {
        String sql = "DELETE FROM movies WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);

        return rowsAffected > 0;
    }
}