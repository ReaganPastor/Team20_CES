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

    // Maps SQL row → Movie object
    private final RowMapper<Movie> movieRowMapper = (rs, rowNum) ->
            new Movie(
                    rs.getLong("id"),
                    rs.getString("title"),
                    rs.getString("description"),
                    rs.getString("rating"),
                    rs.getString("genre"),
                    rs.getString("poster_path"),
                    rs.getString("trailer_path"),
                    rs.getString("status")
            );

    // GET ALL MOVIES with optional filters
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
                if (i < genres.size() - 1)
                    sql.append(",");
                params.add(genres.get(i));
            }

            sql.append(")");
        }

        return jdbcTemplate.query(sql.toString(), movieRowMapper, params.toArray());
    }

    // GET MOVIE BY ID
    public Optional<Movie> getById(Long id) {

        String sql = "SELECT * FROM movies WHERE id = ?";

        List<Movie> results =
                jdbcTemplate.query(sql, movieRowMapper, id);

        return results.stream().findFirst();
    }

    // SEARCH BY TITLE
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
}