package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.model.Movie;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

/*
 * MovieService handles business logic related to movies.
 *
 * NOTE:
 * This will be replaced with a database repository (MovieRepository).
 * Once database is completed
 */
@Service
public class MovieService {

    // Temporary in-memory storage (will be replaced by DB later)
    private final List<Movie> movies = new ArrayList<>();

    public MovieService() {

        // Sample data for testing API endpoints
        movies.add(new Movie(1L, "Dune", "NOW_PLAYING",
                "Sci-Fi", "PG-13",
                "https://example.com/dune.jpg"));

        movies.add(new Movie(2L, "Barbie", "NOW_PLAYING",
                "Comedy", "PG-13",
                "https://example.com/barbie.jpg"));

        movies.add(new Movie(3L, "Kung Fu Panda 4", "COMING_SOON",
                "Animation", "PG",
                "https://example.com/kfp4.jpg"));
    }

    /*
     * Returns all movies.
     * If status filter exists, apply filtering.
     */
    public List<Movie> getAll(Optional<String> status) {

        if (status.isEmpty() || status.get().isBlank()) {
            return movies;
        }

        String s = status.get().trim().toUpperCase(Locale.ROOT);

        return movies.stream()
                .filter(m -> m.getStatus() != null &&
                        m.getStatus().equalsIgnoreCase(s))
                .collect(Collectors.toList());
    }

    /*
     * Returns a movie by ID.
     */
    public Optional<Movie> getById(Long id) {
        return movies.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst();
    }

    /*
     * Searches by title (partial, case-insensitive).
     * Can also apply optional status filtering.
     */
    public List<Movie> searchByTitle(String title, Optional<String> status) {

        String query = title.trim().toLowerCase(Locale.ROOT);

        List<Movie> filtered = movies.stream()
                .filter(m -> m.getTitle() != null &&
                        m.getTitle().toLowerCase(Locale.ROOT).contains(query))
                .collect(Collectors.toList());

        if (status.isEmpty() || status.get().isBlank()) {
            return filtered;
        }

        String s = status.get().trim().toUpperCase(Locale.ROOT);

        return filtered.stream()
                .filter(m -> m.getStatus() != null &&
                        m.getStatus().equalsIgnoreCase(s))
                .collect(Collectors.toList());
    }
}