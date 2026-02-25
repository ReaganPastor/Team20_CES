package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.model.Movie;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final List<Movie> movies = new ArrayList<>();

    public MovieService() {

        movies.add(new Movie(
                1L,
                "Dune",
                "NOW_PLAYING",
                "Sci-Fi",
                "PG-13",
                "https://example.com/dune.jpg",
                2021,
                8.0,
                "A noble family becomes embroiled in a war for control over a desert planet.",
                155
        ));

        movies.add(new Movie(
                2L,
                "Barbie",
                "NOW_PLAYING",
                "Comedy",
                "PG-13",
                "https://example.com/barbie.jpg",
                2023,
                7.0,
                "Barbie begins to question her perfect world.",
                114
        ));

        movies.add(new Movie(
                3L,
                "Kung Fu Panda 4",
                "COMING_SOON",
                "Animation",
                "PG",
                "https://example.com/kfp4.jpg",
                2024,
                0.0,
                "Po faces a new villain and must train a successor.",
                100
        ));
    }

        public List<Movie> getAll(Optional<String> status, List<String> genres) {
        return movies.stream()
                // Filter by status
                .filter(m -> status.isEmpty() || status.get().isBlank() ||
                        (m.getStatus() != null &&
                        m.getStatus().equalsIgnoreCase(status.get().trim())))
                // Filter by genre (match ANY selected genre)
                .filter(m -> genres.isEmpty() || genres.stream()
                        .anyMatch(g -> g.equalsIgnoreCase(m.getGenre())))
                .collect(Collectors.toList());
        } 

    public Optional<Movie> getById(Long id) {
        return movies.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst();
    }

    public List<Movie> searchByTitle(String title, Optional<String> status) {

        String query = title.trim().toLowerCase(Locale.ROOT);

        return movies.stream()
                .filter(m -> m.getTitle() != null &&
                        m.getTitle().toLowerCase(Locale.ROOT).contains(query))

                .filter(m -> status.isEmpty() ||
                        status.get().isBlank() ||
                        (m.getStatus() != null &&
                         m.getStatus().equalsIgnoreCase(
                             status.get().trim().toUpperCase(Locale.ROOT))))

                .collect(Collectors.toList());
    }
}